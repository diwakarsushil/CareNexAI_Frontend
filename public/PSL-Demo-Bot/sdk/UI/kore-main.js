(function($){

    $(document).ready(function () {
        function assertion(options, callback) {
            var jsonData = {
                "clientId": options.clientId,
                "clientSecret": options.clientSecret,
                "identity": options.userIdentity,
                "aud": "",
                "isAnonymous": false
            };
            $.ajax({
                url: options.JWTUrl,
                type: 'post',
                data: jsonData,
                dataType: 'json',
                success: function (data) {
                    options.assertion = data.jwt;
                    options.handleError = koreBot.showError;
                    options.chatHistory = koreBot.chatHistory;
                    options.botDetails = koreBot.botDetails;
                    callback(null, options);
                    setTimeout(function () {
                        if (koreBot && koreBot.initToken) {
                            koreBot.initToken(options);
                        }
                    }, 2000);
                },
                error: function (err) {
                    koreBot.showError(err.responseText);
                }
            });
        }
        function getBrandingInformation(options) {
            if (chatConfig.botOptions && chatConfig.botOptions.enableThemes) {
                var brandingAPIUrl = (chatConfig.botOptions.brandingAPIUrl || '').replace(':appId', chatConfig.botOptions.botInfo._id);
                $.ajax({
                    url: brandingAPIUrl,
                    headers: {
                        'Authorization': "bearer " + options.authorization.accessToken,
                    },
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        if(koreBot && koreBot.applySDKBranding) {
                            koreBot.applySDKBranding(data);
                        }
                        if (koreBot && koreBot.initToken) {
                            koreBot.initToken(options);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }

        }
        function onJWTGrantSuccess(options){
            getBrandingInformation(options);
        }
        
        function getUserIdFromUrl() {
            const defaultUserData = {
                // botHost: 'GTL',
                // agentCode: '011MODC1',
                // firstName: 'Vipul',
                // lastName: 'patel',
                // fullName: 'Vipul patel'
                botHost: null,
                agentCode: null,
                firstName: null,
                lastName: null,
                fullName: null
            };
            const userParamArr = ['botHost', 'agentCode', 'firstName', 'lastName', 'fullName']
            try {
                const params = new URLSearchParams(window.location.search);
                const userData = {};
                for (const key of userParamArr) {
                    userData[key] = params.get(key);
                }
                return userData;
            } catch (err) {
                console.error(err);
                return defaultUserData;
            }
            
        }

        //Function to get Agent data
        // function getAgentData(userData) {
        //     const defaultUserData = {
        //         botHost: null,
        //         agentCode: null,
        //         firstName: null,
        //         lastName: null,
        //         fullName: null
        //     };
        //     if(userData){
        //         console.log(userData)
        //         return userData;
        //     }
        //     else {
        //         return defaultUserData;
        //     }
        // }
        // window.processAgentDetails = getAgentData;

        let meCustomData = localStorage.getItem('AgentDetail')?JSON.parse(localStorage.getItem('AgentDetail')):{};
        function getAgentData(userData) {
            const defaultUserData = {
                botHost: null,
                agentCode: null,
                firstName: null,
                lastName: null,
                fullName: null
            };
            if(userData){
                localStorage.setItem('AgentDetail', JSON.stringify(userData));
                meCustomData = userData;
                var chatConfig=window.KoreSDK.chatConfig;
                chatConfig.botOptions.assertionFn=assertion;
                chatConfig.botOptions.jwtgrantSuccessCB = onJWTGrantSuccess;
                chatConfig.botOptions.botInfo.customData = meCustomData;
            }
            else {
                meCustomData= defaultUserData;
                var chatConfig=window.KoreSDK.chatConfig;
                chatConfig.botOptions.assertionFn=assertion;
                chatConfig.botOptions.jwtgrantSuccessCB = onJWTGrantSuccess;
                chatConfig.botOptions.botInfo.customData = meCustomData;
            }
        }
        window.processAgentDetails = getAgentData;

        // const meCustomData = getAgentData();
        console.log('Custom data', meCustomData);
        meCustomData.botHost="GTL";
        var chatConfig=window.KoreSDK.chatConfig;
        chatConfig.botOptions.assertionFn=assertion;
        chatConfig.botOptions.jwtgrantSuccessCB = onJWTGrantSuccess;
        chatConfig.botOptions.botInfo.customData = meCustomData;
        var koreBot = koreBotChat();
        koreBot.show(chatConfig);
        $('.openChatWindow').click(function () {
            koreBot.show(chatConfig);
        });
    });

})(jQuery || (window.KoreSDK && window.KoreSDK.dependencies && window.KoreSDK.dependencies.jQuery));