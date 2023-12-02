// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Marketplace {
    struct NFT {
        string image; // 图片jpg
        string name;
        uint256 expiry; // 有效期（以秒为单位）
        uint256 discountPercentage; // 优惠百分数
        address creator; // NFT创建者（商家）的地址
    }

    struct User {
        string nickname; // 用户昵称
        bool isMerchant; // 是否是商家
        uint256 expensePoints; // 消费点数
        mapping(uint256 => NFT) ownedNFTs; // 拥有的NFTs
        uint256[] ownedNFTIds; // 拥有的NFT的ID数组
    }

    mapping(address => User) public users;
    mapping(string => address) private nicknameToAddress;
    mapping(address => uint256) public balances; // 用户在合约中的ETH余额
    NFT[] public nfts;

    // 定义事件
    event UserRegistered(address indexed userAddress, bool isMerchant, string nickname);
    event NFTCreated(address indexed creator, string image, string name, uint256 expiry, uint256 discountPercentage);
    event Deposit(address indexed user, uint256 amount);
    event WalletTransfer(address indexed buyer, address indexed seller, uint256 actualAmount);
    event CardDrawn(address indexed userAddress, bool success, uint256 nftId);
    event CardDrawFailed(address userAddress);

    // 注册用户
    function registerUser(string memory _nickname, bool _isMerchant, uint256 _expensePointsRequirement) external {
        require(bytes(_nickname).length > 0 && bytes(_nickname).length != 40, unicode"昵称长度应大于零且不等于40");
        require(nicknameToAddress[_nickname] == address(0), unicode"昵称已被使用");
        require(bytes(users[msg.sender].nickname).length == 0, unicode"用户不能重复注册");
        require(_expensePointsRequirement <= 10, unicode"请设置一个小于等于10的消费点数");

        User storage newUser = users[msg.sender];
        newUser.nickname = _nickname;
        newUser.isMerchant = _isMerchant;
        newUser.expensePoints = _isMerchant ? _expensePointsRequirement : 0;

        nicknameToAddress[_nickname] = msg.sender;
        emit UserRegistered(msg.sender, _isMerchant, _nickname);
    }

    // 创建NFT
    function createNFT(string memory _image, string memory _name, uint256 _expiryInSeconds, uint256 _discountPercentage) external {
        require(users[msg.sender].isMerchant, unicode"只有商家才能创建 NFT");

        nfts.push(NFT({
            image: _image,
            name: _name,
            expiry: block.timestamp + _expiryInSeconds,
            discountPercentage: _discountPercentage,
            creator: msg.sender
        }));
        uint256 nftId = nfts.length - 1;
        
        User storage user = users[msg.sender];
        user.ownedNFTs[nftId] = nfts[nftId];
        user.ownedNFTIds.push(nftId);

        emit NFTCreated(msg.sender, _image, _name, nfts[nftId].expiry, _discountPercentage);
    }

    function getUserNFTs(address userAddress) external view returns (string[] memory, string[] memory, uint256[] memory, uint256[] memory) {
        User storage user = users[userAddress];
        uint256[] memory nftIds = user.ownedNFTIds;
        string[] memory nftImages = new string[](nftIds.length);
        string[] memory nftNames = new string[](nftIds.length);
        uint256[] memory nftExpiryTimes = new uint256[](nftIds.length);
        uint256[] memory nftDiscountPercentages = new uint256[](nftIds.length);

        for (uint256 i = 0; i < nftIds.length; i++) {
            NFT storage nft = user.ownedNFTs[nftIds[i]];
            nftImages[i] = nft.image;
            nftNames[i] = nft.name; // 假设NFT结构体中有一个name属性
            nftExpiryTimes[i] = nft.expiry; // 假设NFT结构体中有一个expiry属性
            nftDiscountPercentages[i] = nft.discountPercentage; // 假设NFT结构体中有一个discountPercentage属性
        }

        return (nftImages, nftNames, nftExpiryTimes, nftDiscountPercentages);
    }

    // 获取所有NFTs
    function getAllNFTs() external view returns (string[] memory, string[] memory, uint256[] memory, uint256[] memory) {
        string[] memory nftImages = new string[](nfts.length);
        string[] memory nftNames = new string[](nfts.length);
        uint256[] memory nftExpiryTimes = new uint256[](nfts.length);
        uint256[] memory nftDiscountPercentages = new uint256[](nfts.length);

        for (uint256 i = 0; i < nfts.length; i++) {
            NFT storage nft = nfts[i];
            nftImages[i] = nft.image;
            nftNames[i] = nft.name;
            nftExpiryTimes[i] = nft.expiry;
            nftDiscountPercentages[i] = nft.discountPercentage;
        }

        return (nftImages, nftNames, nftExpiryTimes, nftDiscountPercentages);
    }

    // 允许用户存款（发送ETH到合约）
    function deposit(uint256 value) external payable {
        require(value <= 20, "Deposit value cannot be larger than 20");
        balances[msg.sender] += value;
        emit Deposit(msg.sender, value);
    }

    // 钱包转账
    function walletTransfer(address payable _sellerAddress, uint256 amount) external {
        require(amount > 0, "The amount should be larger than 0");

        uint256 actualAmount = amount;
        User storage buyer = users[msg.sender];

        // 检查买方是否拥有优惠的NFT
        for (uint i = 0; i < buyer.ownedNFTIds.length; i++) {
            NFT storage nft = buyer.ownedNFTs[buyer.ownedNFTIds[i]];
            if (nft.creator == _sellerAddress && nft.expiry > block.timestamp) {
                actualAmount = amount * (100 - nft.discountPercentage) / 100;
                break;
            }
        }

        balances[msg.sender] -= actualAmount;
        balances[_sellerAddress] += actualAmount;

        // 如果卖方是商家，则增加买方的消费点数
        if (users[_sellerAddress].isMerchant) {
            buyer.expensePoints += actualAmount;
        }

        emit WalletTransfer(msg.sender, _sellerAddress, actualAmount);
    } 

    // 抽卡
    mapping(uint256 => uint256) internal merchantNFTIndices;

    function drawCard(string memory _nickname) public {
        address userAddress = resolveAddress(_nickname);
        require(users[userAddress].isMerchant, unicode"目标不是商家，请重新输入地址");

        User storage user = users[msg.sender];
        require(user.expensePoints >= users[userAddress].expensePoints, unicode"没有抽卡资格");

        user.expensePoints -= users[userAddress].expensePoints;

        // 简化的概率逻辑
        if (random() % 10 < 7) {
            uint256 nftId = random() % nfts.length;
            user.ownedNFTs[nftId] = nfts[nftId];
            user.ownedNFTIds.push(nftId);

            // 将商家拥有的 NFT 的索引存储到商家的索引映射中
            merchantNFTIndices[nftId] = user.ownedNFTIds.length - 1;

            // 在用户抽到 NFT 后，调用 removeMerchantNFT 函数删除商家对应的 NFT
            removeMerchantNFT(userAddress, nftId);

            emit CardDrawn(msg.sender, true, nftId);
        } else {
            emit CardDrawFailed(msg.sender);
        }
    }

    function removeMerchantNFT(address merchantAddress, uint256 nftId) internal {
        require(users[merchantAddress].isMerchant, unicode"目标不是商家，请重新输入地址");

        User storage merchant = users[merchantAddress];

        // 从商家的索引映射中获取用户拥有的 NFT 的索引
        uint256 userNFTIndex = merchantNFTIndices[nftId];

        // 从用户的 NFT 数组中删除商家的 NFT
        delete merchant.ownedNFTs[nftId];
        delete merchant.ownedNFTIds[userNFTIndex];

        if (userNFTIndex != merchant.ownedNFTIds.length - 1) {
            merchant.ownedNFTs[merchant.ownedNFTIds[userNFTIndex]] = merchant.ownedNFTs[merchant.ownedNFTIds[merchant.ownedNFTIds.length - 1]];
            merchant.ownedNFTIds[userNFTIndex] = merchant.ownedNFTIds[merchant.ownedNFTIds.length - 1];
        }

        // 从商家的索引映射中删除该索引
        delete merchantNFTIndices[nftId];

        merchant.ownedNFTIds.pop();
    }

    // 查询地址
    function resolveAddress(string memory _nickname) public view returns (address) {
        require(nicknameToAddress[_nickname] != address(0), unicode"昵称未注册");
        return nicknameToAddress[_nickname];
    }

    // 辅助函数：生成随机数
    function random() private view returns (uint) {
       return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
    }
}
