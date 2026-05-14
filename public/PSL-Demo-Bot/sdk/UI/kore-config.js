(function (KoreSDK) {
    const ENV = 'LOCAL'; // LOCAL || DEV || QA || UAT || PROD 
    var hostnameGTLOrUNL = new URLSearchParams(window.location.search).get('botHost');

    // if(hostnameGTLOrUNL!="GTL" && hostnameGTLOrUNL!="UNL"){
    //     hostnameGTLOrUNL="GTL";
    // }
    hostnameGTLOrUNL = "CareNexAI";

    let HostURLWhereIframeTobeEmbedded = [];
    var KoreSDK = KoreSDK || {};
    let UserIdentity;

    UserIdentity = koreGenerateUUID()

    function koreGenerateUUID() {
        // console.info("generating UUID");
        var d = new Date().getTime()
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now() //use high-precision timer if available
        }

        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                var r = (d + Math.random() * 16) % 16 | 0
                d = Math.floor(d / 16)
                return (c == "x" ? r : (r & 0x3) | 0x8).toString(16)
            }
        )
        return uuid
    }



    var botOptions = {};


    botOptions.logLevel = 'debug';
    botOptions.koreAPIUrl = "https://platform.kore.ai/api/";
    botOptions.koreSpeechAPIUrl = "";//deprecated
    //botOptions.bearer = "bearer xyz-------------------";
    //botOptions.ttsSocketUrl = '';//deprecated
    botOptions.koreAnonymousFn = koreAnonymousFn;
    botOptions.recorderWorkerPath = '../libs/recorderWorker.js';

    botOptions.userIdentity = UserIdentity;

    /* 
    Important Note: These keys are provided here for quick demos to generate JWT token at client side but not for Production environment.
    Refer below document for JWT token generation at server side. Client Id and Client secret should maintained at server end.
    https://developer.kore.ai/docs/bots/sdks/user-authorization-and-assertion/
    **/
    console.log('***11. ENV==', ENV);



    switch (ENV) {
        case 'LOCAL':
            botOptions.JWTUrl = "https://botjwtinsurance.onrender.com/api/users/sts",

                botOptions.botInfo = { name: hostnameGTLOrUNL, "_id": "st-b79730af-2905-5c5c-94f5-4281396722dd" };
            botOptions.clientId = "cs-a41eef29-d9ff-5510-8e1a-7320ba661e02";
            botOptions.clientSecret = "80TbhQUfRKlWeYDfR8eD12mBJUWekzyzEpSAGFVnJo4=";

            HostURLWhereIframeTobeEmbedded.push("http://localhost:5000");
            HostURLWhereIframeTobeEmbedded.push("http://localhost:5173"); // Replace this url with website url where this bot is going to embeded.
            HostURLWhereIframeTobeEmbedded.push("https://carenexai.onrender.com");
            break;
        case 'DEV':
            /** Dev Bot creds */
            // botOptions.botInfo = { name: hostnameGTLOrUNL, "_id": "st-e1596d6f-e2f6-5167-beb0-64625bd27a68" }; // bot name is case sensitive
            // botOptions.clientId = "cs-d3b38a05-d229-552f-ba03-f636c50c3668";
            // botOptions.clientSecret = "U5S/7atJAgdyvFE3tOEEgmdK3VvvsindzK97Qpq2Kvc=";
            botOptions.JWTUrl = "https://gtlchatbotdev.niceplant-f0922409.northcentralus.azurecontainerapps.io/api/users/sts",
                /**Dev Smartassist creds */
                botOptions.botInfo = { name: hostnameGTLOrUNL + ' Dev', "_id": "st-833afa05-f64c-5657-96cb-32ffa764c559" }; // bot name is case sensitive
            botOptions.clientId = "cs-5b1907a8-31d9-5734-a824-1f82ac150a23";
            botOptions.clientSecret = "jFoq0JmD3gaPJaRQiFww/5e78SViyYj0rYlWKfk1iCY=";

            HostURLWhereIframeTobeEmbedded.push("http://localhost:5000");
            HostURLWhereIframeTobeEmbedded.push("http://localhost:3001");
            HostURLWhereIframeTobeEmbedded.push("http://localhost:3000"); // Replace this url with website url where this bot is going to embeded.
            break;
        case 'QA':
            /** QA Smart Assist creds */
            botOptions.JWTUrl = "https://gtlchatbotqanew.agreeabledune-f2f3fae3.northcentralus.azurecontainerapps.io/api/users/sts",
                botOptions.botInfo = { name: hostnameGTLOrUNL + ' QA', "_id": "st-c09b6eeb-b855-50ca-941c-b62ba17ea2cc" };
            botOptions.clientId = "cs-829d84e1-fd62-52e8-b6e6-602ed4d53f87";
            botOptions.clientSecret = "FNnuyp7a/QWLLWE+FOuEpQPfx8k4+npEhLbv3mXHXDQ=";

            //HostURLWhereIframeTobeEmbedded="http://localhost:3001" // Replace this url with website url where this bot is going to embeded.

            // if(hostnameGTLOrUNL=="GTL")
            //     HostURLWhereIframeTobeEmbedded="https://eapp-react-qa.gtlic.com";
            // else if(hostnameGTLOrUNL=="UNL")
            //     HostURLWhereIframeTobeEmbedded="https://eapp-react-unl-qa.gtlic.com";

            HostURLWhereIframeTobeEmbedded.push("https://eapp-react-qa.gtlic.com");
            HostURLWhereIframeTobeEmbedded.push("https://eapp-mod.gtlic.com");
            HostURLWhereIframeTobeEmbedded.push("https://gtlink-mvc-mod.gtlic.com");
            // HostURLWhereIframeTobeEmbedded.push("http://localhost:5000");
            // HostURLWhereIframeTobeEmbedded.push("http://localhost:3001");
            HostURLWhereIframeTobeEmbedded.push("http://localhost:3000");

            break;

        case 'UAT':
            botOptions.JWTUrl = "https://gtlchatbotuat.calmcliff-8942261c.northcentralus.azurecontainerapps.io/api/users/sts",
                botOptions.botInfo = { name: hostnameGTLOrUNL + ' UAT', "_id": "st-9789152c-c82e-5b2f-b2ef-41443619d3af" };
            botOptions.clientId = "cs-5abff2ea-4b3f-5db5-b7be-112260df0aa8";
            botOptions.clientSecret = "7cvMeJ9MmdDR/eC89gBM1vnpj7DA91oSVQDVImJn1sU=";

            HostURLWhereIframeTobeEmbedded.push("http://localhost:3000");
            HostURLWhereIframeTobeEmbedded.push("https://eapp-mod.gtlic.com");
            HostURLWhereIframeTobeEmbedded.push("https://gtlink-mvc-mod.gtlic.com");

            break;

        case 'PROD':
            botOptions.JWTUrl = "https://gtlchatbotprod.agreeabledune-f2f3fae3.northcentralus.azurecontainerapps.io/api/users/sts",
                botOptions.botInfo = { name: hostnameGTLOrUNL, "_id": "st-146ce5d2-d5d1-536b-9cac-dfcdebc6de13" }; // bot name is case sensitive
            botOptions.clientId = "cs-8cd8c8de-2cf3-5822-b9df-820e1112d829";
            botOptions.clientSecret = "sniYxoAJ36iXRis9NbcW/Zh10KfV8Trf05lxLwhBWME=";

            HostURLWhereIframeTobeEmbedded.push("http://localhost:3000");
            HostURLWhereIframeTobeEmbedded.push("https://eapp-mod.gtlic.com");
            HostURLWhereIframeTobeEmbedded.push("https://gtlink-mvc-mod.gtlic.com");
            HostURLWhereIframeTobeEmbedded.push("https://eapp.gtlic.com");
            break;
    }

    botOptions.brandingAPIUrl = botOptions.koreAPIUrl + 'websdkthemes/' + botOptions.botInfo._id + '/activetheme';
    botOptions.enableThemes = true;
    botOptions.HostURLWhereIframeTobeEmbedded = HostURLWhereIframeTobeEmbedded

    console.log('## botOptions.JWTUrl=', botOptions.JWTUrl)
    console.log('## botOptions.HostURLWhereIframeTobeEmbedded=', botOptions.HostURLWhereIframeTobeEmbedded)

    // for webhook based communication use following option 
    // botOptions.webhookConfig={
    //     enable:true,
    //     webhookURL:'PLEASE_PROVIDE_WEBHOOK_URL',
    //     useSDKChannelResponses: false, //Set it to true if you would like to use the responses defined for Web/Mobile SDK Channel
    //     apiVersion:2 //webhookURL will be converted to v2 by default. To use v1(not recommended) webhookURL change it to 1
    // }

    // To modify the web socket url use the following option
    // botOptions.reWriteSocketURL = {
    //     protocol: 'PROTOCOL_TO_BE_REWRITTEN',
    //     hostname: 'HOSTNAME_TO_BE_REWRITTEN',
    //     port: 'PORT_TO_BE_REWRITTEN'
    // };

    var chatConfig = {
        botOptions: botOptions,
        allowIframe: false, 			// set true, opens authentication links in popup window, default value is "false"
        isSendButton: true, 			// set true, to show send button below the compose bar
        isTTSEnabled: false,			// set true, to hide speaker icon
        ttsInterface: 'webapi',
        isPaperclipEnabled: false,         // webapi or awspolly , where default is webapi
        isSpeechEnabled: false,			// set true, to hide mic icon
        stt: {
            vendor: 'webapi',           //'webapi'|'azure'|'google' //uses respective settings from the following keys and uncomments respective files in index.html
            azure: {
                subscriptionKey: '',
                recognitionLanguage: 'en-US',
                recognitionMode: 'Interactive' //Interactive/Dictation/Conversation/Interactive
            },
            google: {
                apiKey: "",
                recognitionLanguage: "en-US"
            },
            webapi: {
                recognitionLanguage: 'en-US'
            }
        },
        allowLocation: true,			// set false, to deny sending location to server
        loadHistory: true, //false,				// set true to load recent chat history
        messageHistoryLimit: 10,		// set limit to load recent chat history
        autoEnableSpeechAndTTS: false, 	// set true, to use talkType voice keyboard.
        graphLib: "d3",				// set google, to render google charts.This feature requires loader.js file which is available in google charts documentation.
        googleMapsAPIKey: "",
        minimizeMode: true,             // set true, to show chatwindow in minimized mode, If false is set remove #chatContainer style in chatwindow.css  
        multiPageApp: {
            enable: true,              //set true for non SPA(Single page applications)
            userIdentityStore: 'localStorage',//'localStorage || sessionStorage'
            chatWindowStateStore: 'localStorage'//'localStorage || sessionStorage'
        },
        supportDelayedMessages: true,    // enable to add support for renderDelay in message nodes which will help to render messages with delay from UI       
        maxTypingIndicatorTime: 40000,   //time in milliseconds,typing indicator will be stopped after this time limit,even bot doesn't respond 
        pickersConfig: {
            showDatePickerIcon: false,           //set true to show datePicker icon
            showDateRangePickerIcon: false,      //set true to show dateRangePicker icon
            showClockPickerIcon: false,          //set true to show clockPicker icon
            showTaskMenuPickerIcon: false,       //set true to show TaskMenu Template icon
            showradioOptionMenuPickerIcon: false //set true to show Radio Option Template icon
        },
        sendFailedMessage: {
            MAX_RETRIES: 3
        }
    };
    /* 
       allowGoogleSpeech will use Google cloud service api.
       Google speech key is required for all browsers except chrome.
       On Windows 10, Microsoft Edge will support speech recognization.
    */




    KoreSDK.chatConfig = chatConfig
})(window.KoreSDK);
