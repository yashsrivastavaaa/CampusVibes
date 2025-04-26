import { Cloudinary } from '@cloudinary/url-gen';
import { upload } from 'cloudinary-react-native';

export const cld = new Cloudinary({
    cloud: {
        cloudName: process.env.CLOUDINARY_NAME,
        apiKey: process.env.CLOUDINARY_API,
    },
    url: {
        secure: true,
    },
});

export const options = {
    upload_preset: process.env.CLOUDINARY_PRESET,
    tag: 'sample',
    unsigned: true,
}