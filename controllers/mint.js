var parseUrl = require("body-parser");
const User = require("../models/Users");
const API_KEY = "sk_live_76ec3775-7189-435d-9481-76cdf013e261";

const cloudinary = require("./cloudinary");



// const opts = {
//   overwrite: true,
//   invalidate: true,
//   resource_type: "auto",
// };

let encodeUrl = parseUrl.urlencoded({ extended: false });
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
var multipart = require("connect-multiparty");
const Transactions = require("../models/Transactions");
var multipartmiddleware = multipart();
const mintcontroller = async (req, res) => {
  // app.post("/image/nft", async(req, res) => {
  try {
    // console.log(req.files.image);
    const sdk = require("api")("@verbwire/v1.0#4psk2mplfwliyql");
    let imgdata = "none";
    sdk.auth("sk_live_76ec3775-7189-435d-9481-76cdf013e261");
    // await sdk
    //   .postNftStoreMetadatafromimage(
    //     {
    //       filePath: "./img.jpg",
    //       name: req.body.name,
    //       description: req.body.description,
    //       data: req.body.data || "",
    //     },
    //     { accept: "application/json" }
    //   )

    await sdk
      .postNftStoreMetadatafromimageurl(
        {
          fileUrl: req.body.fileUrl,

          name: req.body.name,
          description: req.body.description,
        }
        // ,{ accept: "application/json" }
      )
      .then(async ({ data }) => {
        console.log("ipfs ka data", data.ipfs_storage.metadata_url);
        await sdk.auth("sk_live_76ec3775-7189-435d-9481-76cdf013e261");
        console.log(data.ipfs_storage.metadata_url);
        sdk
          .postNftMintQuickmintfrommetadataurl(
            {
              allowPlatformToOperateToken: "true",
              chain: req.body.chain,
              metadataUrl: data.ipfs_storage.metadata_url,
              recipientAddress: req.body.recipientAddress,
            },
            { accept: "application/json" }
          )
          .then(async ({ data }) => {
            console.log(data);
            const user = await User.findOne({ wid: req.body.wid });
            if (!user) return res.status(400).send("User not found");
            user.transactionids.push({
              transactionid: data.quick_mint.transactionID,
              userId: req.body.userId,
            });
            await user.save();

            return res.json(data);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));

    // console.log("ipfs response data:", imgdata);
    // res.send(imgdata);

    // });
  } catch (err) {
    console.log(err);
  }
};
const getTransactionids = async (req, res) => {
  try {
    const alltransactions = await Transactions.find({})
      .populate("userId")
      .exec();
    return res.json(alltransactions);
  } catch (e) {
    console.log(e);
  }
};

const transaction = async (req, res) => {
  try {
    const sdk = require("api")("@verbwire/v1.0#4psk2mplfwliyql");

    sdk.auth("sk_live_76ec3775-7189-435d-9481-76cdf013e261");
    sdk
      .getNftUseropsIpfsuploads()
      .then(({ data }) => {
        console.log(data);
        return res.json(data);
      })
      .catch((err) => console.error(err));
  } catch (e) {
    console.log(e);
  }
};
const getTxn = async (req, res) => {
  try {
    const transaction = await Transactions.findOne({
      transactionid: req.body.transactionid,
    })
      .populate("userId")
      .exec();
    const sdk = require("api")("@verbwire/v1.0#4psk2mplfwliyql");

    sdk.auth("sk_live_76ec3775-7189-435d-9481-76cdf013e261");
    sdk
      .postNftUseropsTransactiondetails(
        {
          transactionId: req.body.transactionid,
        },
        { accept: "application/json" }
      )
      .then(async ({ data }) => {
        console.log(data);

        //   const link = data.transaction_details.details[0].startTokenURI;
        // const ldata = await axios.get(link);

        //   // const link1 = link.split('/');
        //   return res.json(ldata.data)
        return res.json({
          data: data.transaction_details.details[0].startTokenURI,
          contractAddress: data.transaction_details.details[0].contractAddress,
        });
      })
      .catch((err) => console.error(err));
  } catch (e) {
    console.log(e);
  }
};
const cloudupload = async (req, res) => {
  try {
    const file =await req.files.image;
console.log(file)
    //imgage = > base64
    //   return new Promise((resolve, reject) => {
    //      cloudinary.uploader.upload(image, opts, (error, result) => {
    //       if (result && result.secure_url) {
    //         console.log(result.secure_url);
    //         return resolve(result.secure_url);
    //       }
    //       console.log(error.message);
    //       return reject({ message: error.message });
    //     });
    //   });
    // };
    // uploadImage(req.files);
    // let result;
    try {
      // result = await cloudinary.uploader.upload(file.tempFilePath, {
      //   folder: "images",
      // });
     let result = await cloudinary.uploader.upload(file.tempFilePath, { resource_type: "auto" }, (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).send(error);
        }
        console.log(result);
        res.send(result);
    })
   } catch (err) {
      console.log(err);
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  mintcontroller,
  getTransactionids,
  transaction,
  getTxn,
  cloudupload,
};