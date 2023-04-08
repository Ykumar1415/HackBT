var parseUrl = require("body-parser");
const User = require("../models/Users");
const API_KEY = "sk_live_76ec3775-7189-435d-9481-76cdf013e261";

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
              userId:req.body.userId
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
// const getdata = async (req, res)=>{
//   try{
// const transactionid = req.body.transactionID; 
// const trnsxn = await Transactions.findOne({wid : })


//   }catch(e){
//     console.log(e)
//   }
// }

module.exports = {
  mintcontroller,
};
