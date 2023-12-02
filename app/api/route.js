import fs from 'fs';
import path from 'path';





// 禁用 Next.js 默认的 bodyParser，因为我们将使用 formidable 来处理上传的数据
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request) {

    // console.log(request)
    console.log('this is api')
    
    const formData = await request.formData()

    console.log('Server Receive Data')
    const imageName = formData.get('imageName')
    const imageData = formData.get('imageData')
    
    
    const imageContents = imageData.replace(/^data:image\/png;base64,/, "");

    const fileName = `./public/${imageName}`
    fs.writeFile(fileName, imageContents, 'base64', function (err) { console.log(err) });
    console.log(imageName)
    return Response.json({imageName})
}