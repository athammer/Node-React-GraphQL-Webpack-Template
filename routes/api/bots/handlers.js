'use strict';
let sequelize = require('sequelize');
let request = require('request');
let axios = require('axios');
let get = require('lodash/get');
let pull = require('lodash/pull');

let botsRouteHandlers = {

    depositItems: function (req, res, next) {
        let profileURL = get(req.body, 'profileURL', '');
        let profileNumber = get(req.body, 'profileNumber', '');
        var xsrf;
        var cookie;
        request.post("https://api.roblox.com/sign-out/v1", (error, response, body) => {
            if (error) {
                console.error(error);
                return res.status(500).send({ resp: 'Error logging into bot on server on request signout' });
            }

            if (!response.headers['x-csrf-token']) {
                console.error("ERROR WITH XSRF TOKEN!");
            }

            xsrf = response.headers['x-csrf-token'];

            request.post("https://auth.roblox.com/v2/login", {
                body: JSON.stringify({
                    "ctype": "Username",
                    "cvalue": 'ddd',
                    "password": 'dddd'
                }),
                headers: {
                    "Content-Type": "text/json",
                    "X-CSRF-TOKEN": xsrf
                }
            }, (error, response, body) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send({ resp: 'Error logging into bot on server on request signin' });
                }

                if (response.statusCode == 200) {
                    cookie = response.headers['set-cookie'][0].split(";")[0];
                    //https://v3rmillion.net/showthread.php?tid=651767
                    console.log("Logged in!");

                    request.get("https://www.roblox.com/users/inventory/list-json?assetTypeId=8&itemsPerPage=100000&userId=" + profileNumber, {
                        headers: {
                            Cookie: cookie,
                            "Content-Type": "text/json",
                            "X-CSRF-TOKEN": xsrf
                        }
                    }, (error, response, body) => {
                        let hatResp = JSON.parse(body);
                        if (error) {
                            console.error(error);
                            return res.status(500).send({ resp: 'Error getting hats from user.' });
                        }

                        request.get("https://www.roblox.com/users/inventory/list-json?assetTypeId=18&itemsPerPage=100000&userId=" + profileNumber, {
                            headers: {
                                Cookie: cookie,
                                "Content-Type": "text/json",
                                "X-CSRF-TOKEN": xsrf
                            }
                        }, (error, response, body) => {
                            let faceResp = JSON.parse(body);
                            if (error) {
                                console.error(error);
                                return res.status(500).send({ resp: 'Error getting faces from user.' });
                            }

                            request.get("https://www.roblox.com/users/inventory/list-json?assetTypeId=19&itemsPerPage=100000&userId=" + profileNumber, {
                                headers: {
                                    Cookie: cookie,
                                    "Content-Type": "text/json",
                                    "X-CSRF-TOKEN": xsrf
                                }
                            }, (error, response, body) => {
                                let gearResp = JSON.parse(body);
                                //console.log(hatResp)
                                //console.log('===================================================================================================================')
                                // console.log(faceResp)
                                // console.log('===================================================================================================================')
                                // console.log(gearResp)

                                if (error) {
                                    console.error(error);
                                    return res.status(500).send({ resp: 'Error getting gear from user.' });
                                }
                                console.log(hatResp + "--=---==========")
                                let hatLimiteds = []
                                for(let i = 0; i < hatResp.Data.Items.length; i++) {
                                    if(hatResp.Data.Items[i].Product && hatResp.Data.Items[i].Product.IsLimited) {
                                        hatLimiteds.push(hatResp.Data.Items[i])
                                    }
                                }

                                let faceLimiteds = []
                                for(let i = 0; i < faceResp.Data.Items.length; i++) {
                                    if(hatResp.Data.Items[i].Product && faceResp.Data.Items[i].Product.IsLimited) {
                                        faceLimiteds.push(faceResp.Data.Items[i])
                                    }
                                }

                                let gearLimiteds = []
                                for(let i = 0; i < gearResp.Data.Items.length; i++) {
                                    if(hatResp.Data.Items[i].Product && gearResp.Data.Items[i].Product.IsLimited) {
                                        gearLimiteds.push(gearResp.Data.Items[i])
                                    }
                                }
                                console.log(hatLimiteds)
                                console.log(faceLimiteds)
                                console.log(gearLimiteds)
                                let limiteds = hatLimiteds.concat(faceLimiteds, gearLimiteds)
                                console.log(JSON.stringify(limiteds))

                            })
                        })


                        //https://www.roblox.com/users/inventory/list-json?assetTypeId=8&itemsPerPage=100000&userId=428
                        //get all hats
                        //https://www.roblox.com/users/inventory/list-json?assetTypeId=8&cursor=&itemsPerPage=100000&pageNumber=1&sortOrder=Desc&userId=428
                        //get all faces
                        //https://www.roblox.com/users/inventory/list-json?assetTypeId=18&cursor=&itemsPerPage=100000&pageNumber=1&sortOrder=Desc&userId=428
                        //get all gear
                        //https://www.roblox.com/users/inventory/list-json?assetTypeId=19&cursor=&itemsPerPage=100000&pageNumber=1&sortOrder=Desc&userId=428
                    })

                    let aaaa = `{"AgentOfferList":[{"AgentID":46591508,"OfferList":[{"UserAssetID":"5452932459","Name":"The Classic ROBLOX Fedora","ItemLink":"https://www.roblox.com/catalog/1029025/The-Classic-ROBLOX-Fedora","ImageLink":"https://www.roblox.com/asset-thumbnail/image?assetId=1029025&height=110&width=110","AveragePrice":53199,"OriginalPrice":900,"SerialNumber":"---","SerialNumberTotal":"---","MembershipLevel":null}],"OfferRobux":0,"OfferValue":53199},{"AgentID":30574810,"OfferList":[{"UserAssetID":"7979659835","Name":"The Classic ROBLOX Fedora","ItemLink":"https://www.roblox.com/catalog/1029025/The-Classic-ROBLOX-Fedora","ImageLink":"https://www.roblox.com/asset-thumbnail/image?assetId=1029025&height=110&width=110","AveragePrice":53199,"OriginalPrice":900,"SerialNumber":"---","SerialNumberTotal":"---","MembershipLevel":null}],"OfferRobux":0,"OfferValue":53199}],"IsActive":false,"TradeStatus":"Open"}`

                    request.post("https://api.roblox.com/sign-out/v1", {
                        headers: {
                            "Cookie": cookie
                        }
                    }, (error, response, body) => {
                        if(error) {
                            return res.status(500).send({ resp: 'Error logging into bot on server on request second signout' });
                        }
                        if (!response.headers['x-csrf-token']) {
                            console.error("ERROR WITH XSRF TOKEN!");
                            return res.status(500).send({ resp: 'Error with XSRF token while logging into bot' });
                        }
                        xsrf = response.headers['x-csrf-token'];
                        request.post("https://www.roblox.com/Trade/tradehandler.ashx", {
                            form: {
                                "cmd": "send",
                                "TradeJSON": aaaa
                            },
                            json: true,
                            headers: {
                                Cookie: cookie,
                                "Content-Type": "text/json",
                                "X-CSRF-TOKEN": xsrf
                            }
                        }, (error, response, body) => {
                            if (error) {
                                console.error(error);
                                return res.status(500).send({ resp: 'Error with XSRF token while logging into bot' });
                            }
                            return res.status(200).send({ resp: "Bot has logged in." });
                        })

                    })
                }
                else {
                    return res.status(500).send({ resp: 'Request did not return 200 status code' });
                }

            })
        })

    }

}

module.exports = botsRouteHandlers;
