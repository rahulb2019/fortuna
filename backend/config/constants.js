module.exports = {
    url: {
        //frontdomain: "http://ec2-3-8-97-117.eu-west-2.compute.amazonaws.com",
        //admindomain: 'http://54.71.18.74:3556/admin/',
        //frontdomain: "http://localhost:4200"
        //admindomain:'http://localhost:3556/admin',
    },
    imageUrl: {
        userImageOriginal: "./public/uploadMedia/images/users/original/",
        userImageThumb: "./public/uploadMedia/images/users/thumb/",
        mimicImageOriginal: "./public/uploadMedia/images/mimics/original/",
        mimicImageThumb: "./public/uploadMedia/images/mimics/thumb/"
    },
    csvUrl: {
        csvFileInsert: "./public/uploadMedia/CSV/",
        dataExport: "public/csv/"
    },
    message: {
        en: {
            //register
            param_missing: "Parameters missing!",
            email_exist: "A user already exists with entered email address",
            success_register: "You are successfully logged In!",
            success_register_gym: "Gym successfully registered!",
            image_upload_success: "Image uploaded successfully"
        }
    }
};