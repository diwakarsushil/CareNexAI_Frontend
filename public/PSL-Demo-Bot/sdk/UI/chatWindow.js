// function accordianPane(id){
//     var display=document.getElementById(id).style.display;
//     // document.getElementById("rows-"+id).colSpan = "10";
//     document.getElementById(id).style.display=display==="table-row" ? "none" : "table-row";
// }
function viewMoreContent(id) {
    var display = document.getElementById(id).style.display;
    document.getElementById(id).style.display =
      display === "block" ? "none" : "block";
  }
  
  function expandList(id) {
    const clickables = document.querySelectorAll('.listLeftContent');
    clickables.forEach(function (clickable) {
      const targetId = clickable.getAttribute('data-target');
      if(targetId===id){
        const targetElement = document.getElementById(targetId);
        
        if(targetElement){
          
          if(targetElement.style.display==='none' || targetElement.style.display===''){
            targetElement.style.display='block';
          }
          else{
            console.log("inside else");
            targetElement.style.display='none';
          }
        }
      }

    })
  }
  
  //Added by Sushil
  // let hostURL='';
  // window.addEventListener("message", function(event){
  //   if(event.data.type==='SET_URL'){
  //     console.log('Event==', event.data.type)
  //     let url = event.data.url;
  //     let urlObject = new URL(url);
  //     let domain=urlObject.hostname;
  //     let port=urlObject.port;
  //     hostURL = port ? `http://${domain}:${port}` : domain;
  //   }
  // });

  function openLink(params) {
    if (params === "forgotPassword")
      window.top.location = `/AgentPortal/ChangePassword`;
    else if (params === "forgotUsername")
      window.top.location = `/AgentPortal/ForgotUserName`;
    else if (params === "forgotAgentCode")
      window.top.location = `/AgentPortal/ForgotAgentCode`;
    else if (params === "login")
      window.top.location = `/AgentPortal/Login`;
  }
  
  //Added By sushil for Chat bot icon tooltip implementation
function closeTitle(){
    
  var minimizedTitle = document.getElementById('minimizedTitle');
  minimizedTitle.style.display='none';
  setTimeout(() => {
    minimizedTitle.style.display='none';
  }, 3000);
}
function openTitle(){
  var minimizedTitle = document.getElementById('minimizedTitle');
  minimizedTitle.style.display='table';
}
function sleep() {
  setTimeout(()=>{
      var minimizedTitle = document.querySelector('.minimized-title');
      minimizedTitle.style.display='table';
  }, 3000); //After 3 second tooltip will appear
}
window.onload = sleep();

window.onload = function () {
  const chatIconDiv = document.getElementById('minimizedChatIcon');
  chatIconDiv.classList.add('non-clickable');
  setTimeout(() => {
      chatIconDiv.classList.remove('non-clickable');
  }, 3000);
}

  var openRow = null;
  function toggleRow(row) {
    var nextRow = row.nextElementSibling;
    if (nextRow && nextRow.classList.contains("hidden")) {
      if (openRow) {
        openRow.classList.add("hidden");
      }
      nextRow.classList.remove("hidden");
      openRow = nextRow;
    } else if (nextRow) {
      nextRow.classList.add("hidden");
      openRow = null;
    }
  }
  
  function morethanFiveRows(id) {
    var display = document.getElementById(id).style.display;
    // document.getElementById("rows-"+id).colSpan = "10";
    document.getElementById(id).style.display =
      display === "table-row" ? "none" : "table-row";
  }
  
  function closeModal() {
    modal.style.display = "none";
  }
  
  const invokeBotFromHostWebsite = (meForMessageEvent) => {
    window.addEventListener("message", function (event) {
      const allowedOrigins =
        meForMessageEvent.config.botOptions.HostURLWhereIframeTobeEmbedded;
      // console.log("!!! allowedOrigins==", allowedOrigins);
      if ( !allowedOrigins.includes(event.origin)) {
        console.error("Rejected postMessage from unknown origin:", event.origin);
        return;
      }
      var _chatContainer = meForMessageEvent.config.chatContainer;
      if (event.data === "openChat") {
        meForMessageEvent.config.botOptions.botInfo.customData.facingIssueOnWeb =
        "LoginError";
        var minimizedElement = _chatContainer.find(
          ".minimized, .minimized-title"
        );
        console.log("## 33 minimizedElement=", minimizedElement);
        if (minimizedElement.length > 0) {
          minimizedElement.click();
        }
      }
      if(event.data === "logOut"){
        meForMessageEvent.removeLocalStoreItem("kr-cw-state");
        meForMessageEvent.removeLocalStoreItem("kr-cw-uid");
        meForMessageEvent.removeLocalStoreItem("AgentDetail");
      }
    })
  }


(function (factory) {
    // if (typeof define === 'function' && define.amd) { // AMD
    //    define(factory);
    //  } else if (typeof module !== 'undefined') {      // CommonJS
    //    module.exports = factory();
    //  } else {                                         // browser globals
    window.koreBotChat = factory();
    //}
  })(function () {
    return function koreBotChat() {
      var koreJquery;
      if (
        window &&
        window.KoreSDK &&
        window.KoreSDK.dependencies &&
        window.KoreSDK.dependencies.jQuery
      ) {
        //load kore's jquery version
        koreJquery = window.KoreSDK.dependencies.jQuery;
      } else {
        //fall back to clients jquery version
        koreJquery = window.jQuery;
      }
  
      var KRPerfectScrollbar;
      if (window.PerfectScrollbar && typeof PerfectScrollbar === "function") {
        KRPerfectScrollbar = window.PerfectScrollbar;
      }
  
      var returnFun = (function ($, KRPerfectScrollbar) {
        //Actual  chatwindow.js koreBotChat function code starts here
  
        var bot = requireKr("/KoreBot.js").instance();
        var _koreBotChat = this;
        var botMessages = {};
        var _botInfo = {};
        var detectScriptTag = /<script\b[^>]*>([\s\S]*?)/gm;
        var _eventQueue = {};
        var carouselEles = [];
        var prevRange,
          accessToken,
          koreAPIUrl,
          fileToken,
          fileUploaderCounter = 0,
          bearerToken = "",
          assertionToken = "",
          messagesQueue = [],
          historyLoading = false;
        var speechServerUrl = "",
          userIdentity = "",
          isListening = false,
          isRecordingStarted = false,
          speechPrefixURL = "",
          sidToken = "",
          carouselTemplateCount = 0,
          waiting_for_message = false,
          loadHistory = false;
        var EVENTS = {
          //chat window exposed events
          OPEN_OVERRIDE: "cw:open:override",
          MESSAGE_OVERRIDE: "cw:message:override",
        };
        var sendFailedMessage = {
          messageId: null,
          MAX_RETRIES: 3,
          retryCount: 0,
        };
        /******************* Mic variable initilization *******************/
        var _exports = {},
          _template,
          _this = {};
        var navigator = window.navigator;
        var mediaStream,
          mediaStreamSource,
          rec,
          _connection,
          intervalKey,
          context;
        var _permission = false;
        var _user_connection = false;
        var CONTENT_TYPE =
          "content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1";
  
        var recorderWorkerPath = "../libs/recorderWorker.js";
        var INTERVAL = 250;
        var _pingTimer,
          _pingTime = 30000;
        /***************** Mic initilization code end here ************************/
  
        /******************************* TTS variable initialization **************/
        var _ttsContext = null,
          _ttsConnection = null,
          ttsServerUrl = "",
          ttsAudioSource = null,
          _txtToSpeak = "",
          optionIndex = 65; // Audio context
        /************************** TTS initialization code end here **************/
  
        /*************************** file upload variable *******************************/
        var appConsts = {};
        var attachmentInfo = {};
        var allowedFileTypes = [
          "m4a",
          "amr",
          "aac",
          "wav",
          "mp3",
          "mp4",
          "mov",
          "3gp",
          "flv",
          "png",
          "jpg",
          "jpeg",
          "gif",
          "bmp",
          "csv",
          "txt",
          "json",
          "pdf",
          "doc",
          "dot",
          "docx",
          "docm",
          "dotx",
          "dotm",
          "xls",
          "xlt",
          "xlm",
          "xlsx",
          "xlsm",
          "xltx",
          "xltm",
          "xlsb",
          "xla",
          "xlam",
          "xll",
          "xlw",
          "ppt",
          "pot",
          "pps",
          "pptx",
          "pptm",
          "potx",
          "potm",
          "ppam",
          "ppsx",
          "ppsm",
          "sldx",
          "sldm",
          "zip",
          "rar",
          "tar",
          "wpd",
          "wps",
          "rtf",
          "msg",
          "dat",
          "sdf",
          "vcf",
          "xml",
          "3ds",
          "3dm",
          "max",
          "obj",
          "ai",
          "eps",
          "ps",
          "svg",
          "indd",
          "pct",
          "accdb",
          "db",
          "dbf",
          "mdb",
          "pdb",
          "sql",
          "apk",
          "cgi",
          "cfm",
          "csr",
          "css",
          "htm",
          "html",
          "jsp",
          "php",
          "xhtml",
          "rss",
          "fnt",
          "fon",
          "otf",
          "ttf",
          "cab",
          "cur",
          "dll",
          "dmp",
          "drv",
          "7z",
          "cbr",
          "deb",
          "gz",
          "pkg",
          "rpm",
          "zipx",
          "bak",
          "avi",
          "m4v",
          "mpg",
          "rm",
          "swf",
          "vob",
          "wmv",
          "3gp2",
          "3g2",
          "asf",
          "asx",
          "srt",
          "wma",
          "mid",
          "aif",
          "iff",
          "m3u",
          "mpa",
          "ra",
          "aiff",
          "tiff",
        ];
        appConsts.CHUNK_SIZE = 1024 * 1024;
        var filetypes = {},
          audio = ["m4a", "amr", "wav", "aac", "mp3"],
          video = ["mp4", "mov", "3gp", "flv"],
          image = ["png", "jpg", "jpeg", "gif"];
        filetypes.audio = audio;
        filetypes.video = video;
        filetypes.image = image;
        filetypes.file = {
          limit: {
            size: 25 * 1024 * 1024,
            msg: "Please limit the individual file upload size to 25 MB or lower",
          },
        };
        filetypes.determineFileType = function (extension) {
          extension = extension.toLowerCase();
          if (filetypes.image.indexOf(extension) > -1) {
            return "image";
          } else if (filetypes.video.indexOf(extension) > -1) {
            return "video";
          } else if (filetypes.audio.indexOf(extension) > -1) {
            return "audio";
          } else {
            return "attachment";
          }
        };
  
        var kfrm = {};
        kfrm.net = {};
        window.PieChartCount = 0;
        window.barchartCount = 0;
        window.linechartCount = 0;
        var available_charts = [];
        var chatInitialize;
        var recognizer;
        var customTemplateObj = {};
        window.chartColors = [
          "#75b0fe",
          "#f78083",
          "#99ed9e",
          "#fde296",
          "#26344a",
          "#5f6bf7",
          "#b3bac8",
          "#99a1fd",
          "#9cebf9",
          "#f7c7f4",
        ];
        /**************************File upload variable end here **************************/
        var _escPressed = 0;
        chatWindow.prototype.isNotAllowedHTMLTags = function (txtStr) {
          var wrapper = document.createElement("div");
          wrapper.innerHTML = txtStr;
  
          var setFlags = {
            isValid: true,
            key: "",
          };
          try {
            if (
              $(wrapper).find("script").length ||
              $(wrapper).find("video").length ||
              $(wrapper).find("audio").length
            ) {
              setFlags.isValid = false;
            }
            if (
              $(wrapper).find("link").length &&
              $(wrapper).find("link").attr("href").indexOf("script") !== -1
            ) {
              if (detectScriptTag.test($(wrapper).find("link").attr("href"))) {
                setFlags.isValid = false;
              } else {
                setFlags.isValid = true;
              }
            }
            if (
              $(wrapper).find("a").length &&
              $(wrapper).find("a").attr("href").indexOf("script") !== -1
            ) {
              if (detectScriptTag.test($(wrapper).find("a").attr("href"))) {
                setFlags.isValid = false;
              } else {
                setFlags.isValid = true;
              }
            }
            if (
              $(wrapper).find("img").length &&
              $(wrapper).find("img").attr("src").indexOf("script") !== -1
            ) {
              if (detectScriptTag.test($(wrapper).find("img").attr("href"))) {
                setFlags.isValid = false;
              } else {
                setFlags.isValid = true;
              }
            }
            if ($(wrapper).find("object").length) {
              setFlags.isValid = false;
            }
  
            return setFlags;
          } catch (e) {
            return setFlags;
          }
        };
  
        chatWindow.prototype.escapeHTML = function (txtStr) {
          //'&': '&amp;',
          var escapeTokens = {
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
          };
          var htmlTags = /[<>"']/g;
          return ("" + txtStr).replace(htmlTags, function (match) {
            return escapeTokens[match];
          });
        };
  
        chatWindow.prototype.koreReplaceAll = function (
          str,
          search,
          replacement
        ) {
          var target = str;
          return target.replace(new RegExp(search, "g"), replacement);
        };
  
        if (!chatWindow.prototype.includes) {
          chatWindow.prototype.includes = function (str, search, start) {
            "use strict";
  
            if (search instanceof RegExp) {
              throw TypeError("first argument must not be a RegExp");
            }
            if (start === undefined) {
              start = 0;
            }
            return str.indexOf(search, start) !== -1;
          };
        }
  
        function findSortedIndex(array, value) {
          var low = 0,
            high = array.length;
  
          while (low < high) {
            var mid = (low + high) >>> 1;
            if (array[mid] < value) low = mid + 1;
            else high = mid;
          }
          return low;
        }
  
        function xssAttack(txtStr) {
          //   if (compObj && compObj[0] && compObj[0].componentType === "text") {
  
          var textHasXSS;
          if (txtStr) {
            textHasXSS = chatInitialize.isNotAllowedHTMLTags(txtStr);
          }
          if (textHasXSS && !textHasXSS.isValid) {
            txtStr = chatInitialize.escapeHTML(txtStr);
          }
          return txtStr;
          //return compObj[0].componentBody;
        }
        function sanitizeXSS(input) {
          var sanitizedInput = input
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;")
            .replace(/\//g, "&#x2F;")
            .replace(/\(/g, "&#40;")
            .replace(/\)/g, "&#41;");
          return sanitizedInput;
        }
  
        var helpers = {
          nl2br: function (str, runEmojiCheck) {
            if (runEmojiCheck) {
              str = window.emojione.shortnameToImage(str);
            }
            str = str.replace(/(?:\r\n|\r|\n)/g, "<br />");
            return str;
          },
          br2nl: function (str) {
            str = str.replace(/<br \/>/g, "\n");
            return str;
          },
          formatAMPM: function (date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? "0" + minutes : minutes;
            //seconds = seconds < 10 ? '0' + seconds : seconds;
            var strTime = hours + ":" + minutes + /*':' + seconds + */ " " + ampm;
            return strTime;
          },
          // 'formatCheckTodayDate': function (date) {
          //     var CurrentDate = new Date();
          //     var todaysdate;
          //     if(date==CurrentDate)
          //     {
          //         todaysdate="Today";
          //     }
  
          //     return todaysdate;
          // },
          formatDate: function (date) {
            var d = new Date(date);
            if (isNaN(d.getTime())) {
              var _tmpDate = new Date().getTime();
              d = new Date(_tmpDate);
            }
            var datedata = d.toDateString();
            //return "Today - " + helpers.formatAMPM(d);
            return datedata + " at " + helpers.formatAMPM(d);
          },
          convertMDtoHTML: function (val, responseType, msgItem) {
            if (typeof val === "object") {
              try {
                val = JSON.stringify(val);
              } catch (error) {
                val = "";
              }
            }
            var hyperLinksMap = {};
            var mdre = {};
            if (msgItem && msgItem.cInfo && msgItem.cInfo.ignoreCheckMark) {
              var ignoreCheckMark = msgItem.cInfo.ignoreCheckMark;
            }
            //mdre.date = new RegExp(/\\d\(\s*(.{10})\s*\)/g);
            mdre.date = new RegExp(
              /\\d\(\s*(.{10})\s*(?:,\s*["'](.+?)["']\s*)?\)/g
            );
            mdre.time = new RegExp(/\\t\(\s*(.{8}\.\d{0,3})\s*\)/g);
            //mdre.datetime = new RegExp(/\\dt\(\s*(.{10})[T](.{12})([z]|[Z]|[+-]\d{4})\s*\)/g);
            mdre.datetime = new RegExp(
              /\\(d|dt|t)\(\s*([-0-9]{10}[T][0-9:.]{12})([z]|[Z]|[+-]\d{4})[\s]*,[\s]*["']([a-zA-Z\W]+)["']\s*\)/g
            );
            mdre.num = new RegExp(/\\#\(\s*(\d*.\d*)\s*\)/g);
            mdre.curr = new RegExp(
              /\\\$\((\d*.\d*)[,](\s*[\"\']\s*\w{3}\s*[\"\']\s*)\)|\\\$\((\d*.\d*)[,](\s*\w{3}\s*)\)/g
            );
  
            var regEx = {};
            regEx.SPECIAL_CHARS =
              /[\=\`\~\!@#\$\%\^&\*\(\)_\-\+\{\}\:"\[\];\',\.\/<>\?\|\\]+/;
            regEx.EMAIL =
              /^[-a-z0-9~!$%^&*_=+}{\']+(\.[-a-z0-9~!$%^&*_=+}{\']+)*@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,255})+$/i;
            regEx.MENTION = /(^|\s|\\n|")@([^\s]*)(?:[\s]\[([^\]]*)\])?["]?/gi;
            regEx.HASHTAG = /(^|\s|\\n)#(\S+)/g;
            regEx.NEWLINE = /\n/g;
            var _regExForLink =
              /((?:http\:\/\/|https\:\/\/|www\.)+\S*\.(?:(?:\.\S)*[^\,\s\.])*\/?)/gi;
            // var _regExForMarkdownLink = /\[([^\]]+)\](|\s)+\(([^\)])+\)/g;
            var _regExForMarkdownLink =
              /\[([^\]]+)\](|\s)\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)?/g;
            var str = val || "";
            var mmntns = {};
            mmntns.sd = new RegExp(/^(d{1})[^d]|[^d](d{1})[^d]/g);
            mmntns.dd = new RegExp(/^(d{2})[^d]|[^d](d{2})[^d]/g);
            mmntns.fy = new RegExp(/(y{4})|y{2}/g);
            var regexkeys = Object.keys(mdre);
            function matchmap(regexval, stringval) {
              var da;
              var matches = [];
              while ((da = regexval.exec(stringval)) !== null) {
                var keypair = {};
                keypair.index = da.index;
                keypair.matchexp = da[0];
                if (da.length > 1) {
                  for (var n = 1; n < da.length; n++) {
                    var mstr = "matchval" + n.toString();
                    keypair[mstr] = da[n];
                  }
                }
                matches.push(keypair);
              }
              return matches;
            }
            function ucreplacer(match) {
              return match.toUpperCase();
            }
            for (var j = 0; j < regexkeys.length; j++) {
              var k;
              switch (regexkeys[j]) {
                case "date":
                  var strvald = str;
                  var datematcharray = matchmap(mdre.date, strvald);
                  if (datematcharray.length) {
                    for (k = 0; k < datematcharray.length; k++) {
                      //var fdate = moment(datematcharray[k].matchval).format('DD,dd,MM,YYY');
                      var fdate = new Date(
                        datematcharray[k].matchval1
                      ).toLocaleDateString();
                      fdate = " " + fdate.toString() + " ";
                      str = str.replace(
                        datematcharray[k].matchexp.toString(),
                        fdate
                      );
                    }
                  }
                  break;
                case "time":
                  var strvalt = str;
                  var timematcharray = matchmap(mdre.time, strvalt);
                  if (timematcharray.length) {
                    for (k = 0; k < timematcharray.length; k++) {
                      var ftime = new Date(
                        timematcharray[k].matchval1
                      ).toLocaleTimeString();
                      ftime = " " + ftime.toString() + " ";
                      str = str.replace(
                        timematcharray[k].matchexp.toString(),
                        ftime
                      );
                    }
                  }
                  break;
                case "datetime":
                  var strvaldt = str;
                  var dtimematcharray = matchmap(mdre.datetime, strvaldt);
                  if (dtimematcharray.length) {
                    for (k = 0; k < dtimematcharray.length; k++) {
                      var ms = "";
                      var mergekeylength =
                        Object.keys(dtimematcharray[k]).length - 2;
                      for (var l = 2; l < mergekeylength; l++) {
                        var keystr = "matchval" + l.toString();
                        ms += dtimematcharray[k][keystr];
                      }
                      var foptionstring = "matchval" + mergekeylength.toString();
                      var fmtstr = dtimematcharray[k][foptionstring];
                      fmtstr = fmtstr.replace(mmntns.fy, ucreplacer);
                      fmtstr = fmtstr.replace(mmntns.dd, ucreplacer);
                      fmtstr = fmtstr.replace(mmntns.sd, ucreplacer);
                      //var fdtime = new Date(dtimematcharray[k].matchval).toLocaleString();
                      var fdtime = moment(ms).format(fmtstr);
                      fdtime = " " + fdtime.toString() + " ";
                      str = str.replace(
                        dtimematcharray[k].matchexp.toString(),
                        fdtime
                      );
                    }
                  }
                  break;
                case "num":
                  var strnumval = str;
                  var nummatcharray = matchmap(mdre.num, strnumval);
                  if (nummatcharray.length) {
                    for (k = 0; k < nummatcharray.length; k++) {
                      var fnum = Number(
                        nummatcharray[k].matchval1
                      ).toLocaleString();
                      fnum = " " + fnum.toString() + " ";
                      str = str.replace(
                        nummatcharray[k].matchexp.toString(),
                        fnum
                      );
                    }
                  }
                  break;
                case "curr":
                  var strcurval = str;
                  var currmatcharray = matchmap(mdre.curr, strcurval);
                  var browserLang =
                    window.navigator.language || window.navigator.browserLanguage;
                  var curcode = new RegExp(/\w{3}/);
                  if (currmatcharray.length) {
                    for (k = 0; k < currmatcharray.length; k++) {
                      var currops = {},
                        fcode;
                      currops.style = "currency";
                      if (currmatcharray[k].matchval2) {
                        fcode = curcode.exec(currmatcharray[k].matchval2);
                      }
                      currops.currency = fcode[0].toString();
                      var fcurr = Number(
                        currmatcharray[k].matchval1
                      ).toLocaleString(browserLang, currops);
                      //check for browser support if browser doesnot suppor we get the same value back and we append the currency Code
                      if (
                        currmatcharray[k].matchval1.toString() ===
                        fcurr.toString()
                      ) {
                        fcurr = " " + fcurr.toString() + " " + currops.currency;
                      } else {
                        fcurr = " " + fcurr.toString() + " ";
                      }
                      str = str.replace(
                        currmatcharray[k].matchexp.toString(),
                        fcurr
                      );
                    }
                  }
                  break;
              }
            }
            function nextLnReplacer(match, p1, offset, string) {
              return "<br/>";
            }
            function ignoreWords(str) {
              var _words = [
                "onclick",
                "onmouse",
                "onblur",
                "onscroll",
                "onStart",
              ];
              _words.forEach(function (word) {
                var regEx = new RegExp(word, "ig");
                str = str.replace(regEx, "");
              });
              return str;
            }
            var nextln = regEx.NEWLINE;
            function linkreplacer(match, p1, offset, string) {
              var dummyString = string.replace(_regExForMarkdownLink, "[]");
              dummyString = ignoreWords(dummyString);
              if (dummyString.indexOf(match) !== -1) {
                var _link = p1.indexOf("http") < 0 ? "http://" + match : match,
                  _target;
                //_link = encodeURIComponent(_link);
                target = "target='underscoreblank'";
                if (hyperLinksMap) {
                  var _randomKey =
                    "korerandom://" + Object.keys(hyperLinksMap).length;
                  hyperLinksMap[_randomKey] = _link;
                  _link = _randomKey;
                }
                return (
                  "<span class='isLink'><a id='linkEvent'" +
                  _target +
                  ' href="' +
                  _link +
                  '">' +
                  match +
                  "</a></span>"
                );
              } else {
                return match;
              }
            }
            //check for whether to linkify or not
            // try {
            //     str = decodeURIComponent(str);
            // } catch (e) {
            //     str = str || '';
            // }
            if (typeof str === "number") {
              str = str.toString();
            }
            str = str || "";
  
            var newStr = "",
              wrapper1;
            if (responseType === "user") {
              // str = sanitizeXSS(str);
              // str = str.replace(/onerror=/gi, '');
              // str = str.replace(/onmouseover=/gi, '');
              str = DOMPurify.sanitize(str, { ADD_TAGS: ["iframe"] });
              wrapper1 = document.createElement("div");
              newStr = str.replace(/“/g, '"').replace(/”/g, '"');
              newStr = newStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");
              wrapper1.innerHTML = xssAttack(newStr);
              if ($(wrapper1).find("a").attr("href")) {
                str = newStr;
              } else {
                str = newStr
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(_regExForLink, linkreplacer);
              }
            } else {
              // str = sanitizeXSS(str);
              // str = str.replace(/onerror=/gi, '');
              // str = str.replace(/onmouseover=/gi, '');
              str = DOMPurify.sanitize(str, { ADD_TAGS: ["iframe"] });
              wrapper1 = document.createElement("div");
              //str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
              wrapper1.innerHTML = xssAttack(str);
              if ($(wrapper1).find("a").attr("href")) {
                var linkArray = str.match(/<a[^>]*>([^<]+)<\/a>/g);
                for (var x = 0; x < linkArray.length; x++) {
                  var _newLA = document.createElement("div");
                  var _detectedLink = linkArray[x];
                  _newLA.innerHTML = linkArray[x];
                  //for mailto: links, new line character need to be repaced with %0A
                  if (
                    _detectedLink.indexOf("href='mailto:") > -1 ||
                    _detectedLink.indexOf('href="mailto:') > -1
                  ) {
                    _detectedLink = _detectedLink.split("\n").join("%0A");
                  }
                  var _randomKey =
                    "korerandom://" + Object.keys(hyperLinksMap).length;
                  _newLA.innerHTML = _detectedLink;
  
                  var _aEle = _newLA.getElementsByTagName("a");
                  if (_aEle && _aEle[0] && _aEle[0].href) {
                    hyperLinksMap[_randomKey] = _aEle[0].href;
                    _aEle[0].href = _randomKey;
                  }
                  $(_newLA).find("a").attr("target", "underscoreblank");
                  str = str.replace(linkArray[x], _newLA.innerHTML);
                }
              } else {
                str = wrapper1.innerHTML
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(_regExForLink, linkreplacer);
              }
            }
            if (ignoreCheckMark) {
              str = val;
            } else {
              str = helpers.checkMarkdowns(str, hyperLinksMap);
            }
            var hrefRefs = Object.keys(hyperLinksMap);
            if (hrefRefs && hrefRefs.length) {
              hrefRefs.forEach(function (hrefRef) {
                function customStrReplacer() {
                  //custom replacer is used as by default replace() replaces with '$' in place of '$$'
                  return hyperLinksMap[hrefRef];
                }
                str = str.replace(hrefRef, customStrReplacer);
              });
            }
            str = chatInitialize.koreReplaceAll(
              str,
              'target="underscoreblank"',
              'target="_blank"'
            );
            // str = str.koreReplaceAll("target='underscoreblank'", 'target="_blank"');
            // if (responseType === 'user') {
            // str = str.replace(/abc-error=/gi, 'onerror=');
            // }
            str = DOMPurify.sanitize(str, { ADD_TAGS: ["iframe"] });
            return helpers.nl2br(str, true);
          },
          checkMarkdowns: function (val, hyperLinksMap) {
            if (val === "") {
              return val;
            }
            var txtArr = val.split(/\r?\n/);
            for (var i = 0; i < txtArr.length; i++) {
              var _lineBreakAdded = false;
              if (
                txtArr[i].indexOf("#h6") === 0 ||
                txtArr[i].indexOf("#H6") === 0
              ) {
                txtArr[i] = "<h6>" + txtArr[i].substring(3) + "</h6>";
                _lineBreakAdded = true;
              } else if (
                txtArr[i].indexOf("#h5") === 0 ||
                txtArr[i].indexOf("#H5") === 0
              ) {
                txtArr[i] = "<h5>" + txtArr[i].substring(3) + "</h5>";
                _lineBreakAdded = true;
              } else if (
                txtArr[i].indexOf("#h4") === 0 ||
                txtArr[i].indexOf("#H4") === 0
              ) {
                txtArr[i] = "<h4>" + txtArr[i].substring(3) + "</h4>";
                _lineBreakAdded = true;
              } else if (
                txtArr[i].indexOf("#h3") === 0 ||
                txtArr[i].indexOf("#H3") === 0
              ) {
                txtArr[i] = "<h3>" + txtArr[i].substring(3) + "</h3>";
                _lineBreakAdded = true;
              } else if (
                txtArr[i].indexOf("#h2") === 0 ||
                txtArr[i].indexOf("#H2") === 0
              ) {
                txtArr[i] = "<h2>" + txtArr[i].substring(3) + "</h2>";
                _lineBreakAdded = true;
              } else if (
                txtArr[i].indexOf("#h1") === 0 ||
                txtArr[i].indexOf("#H1") === 0
              ) {
                txtArr[i] = "<h1>" + txtArr[i].substring(3) + "</h1>";
                _lineBreakAdded = true;
              } else if (txtArr[i].length === 0) {
                txtArr[i] = "\r\n";
                _lineBreakAdded = true;
              } else if (txtArr[i].indexOf("*") === 0) {
                if (!isEven(txtArr[i].split("*").length - 1)) {
                  txtArr[i] = "\r\n&#9679; " + txtArr[i].substring(1);
                  _lineBreakAdded = true;
                }
              } else if (txtArr[i].indexOf(">>") === 0) {
                if (txtArr[i].substring(2).indexOf("*") === 0) {
                  if (!isEven(txtArr[i].substring(2).split("*").length - 1)) {
                    txtArr[i] = "&#9679; " + txtArr[i].substring(3);
                    _lineBreakAdded = true;
                  }
                  txtArr[i] = '<p class="indent">' + txtArr[i] + "</p>";
                } else {
                  txtArr[i] =
                    '<p class="indent">' + txtArr[i].substring(2) + "</p>";
                }
                _lineBreakAdded = true;
              } else if (txtArr[i].indexOf("&gt;&gt;") === 0) {
                if (txtArr[i].substring(8).indexOf("*") === 0) {
                  // add ">>*" for sub bullet point
                  if (!isEven(txtArr[i].substring(8).split("*").length - 1)) {
                    txtArr[i] = "&#9679; " + txtArr[i].substring(9);
                    _lineBreakAdded = true;
                  }
                  txtArr[i] = '<p class="indent">' + txtArr[i] + "</p>";
                } else {
                  multipleIndentation(txtArr, i); // For multiple indentations Ex: >>>>>Indent = "  >Indent"
                }
                _lineBreakAdded = true;
              } else if (
                txtArr[i].indexOf("---") === 0 ||
                txtArr[i].indexOf("___") === 0
              ) {
                txtArr[i] = "<hr/>" + txtArr[i].substring(3);
                _lineBreakAdded = true;
              }
              var j;
              // Matches Image markup ![test](http://google.com/image.png)
              if (txtArr[i].indexOf(" ![") === -1) {
                // replace method trimming last'$' character, to handle this adding ' ![' extra space
                txtArr[i] = txtArr[i].replace("![", " ![");
              }
              var _matchImage = txtArr[i].match(
                /\!\[([^\]]+)\](|\s)+\(([^\)])+\)/g
              );
              if (_matchImage && _matchImage.length > 0) {
                for (j = 0; j < _matchImage.length; j++) {
                  var _imgTxt = _matchImage[j].substring(
                    2,
                    _matchImage[j].indexOf("]")
                  );
                  var remainingString = _matchImage[j]
                    .substring(_matchImage[j].indexOf("]") + 1)
                    .trim();
                  var _imgLink = remainingString.substring(
                    1,
                    remainingString.indexOf(")")
                  );
                  if (hyperLinksMap) {
                    var _randomKey =
                      "korerandom://" + Object.keys(hyperLinksMap).length;
                    hyperLinksMap[_randomKey] = _imgLink;
                    _imgLink = _randomKey;
                  }
                  _imgLink = '<img src="' + _imgLink + '" alt="' + _imgTxt + '">';
                  var _tempImg = txtArr[i].split(" ");
                  for (var k = 0; k < _tempImg.length; k++) {
                    if (_tempImg[k] === _matchImage[j]) {
                      _tempImg[k] = _imgLink;
                    }
                  }
                  txtArr[i] = _tempImg.join(" ");
                  txtArr[i] = txtArr[i].replace(_matchImage[j], _imgLink);
                }
              }
              // Matches link markup [test](http://google.com/)
              //var _matchLink = txtArr[i].match(/\[([^\]]+)\](|\s)+\(([^\)])+\)/g);
              var _matchLink = txtArr[i].match(
                /\[([^\]]+)\](|\s)\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g
              );
              if (_matchLink && _matchLink.length > 0) {
                for (j = 0; j < _matchLink.length; j++) {
                  var _linkTxt = _matchLink[j].substring(
                    1,
                    _matchLink[j].indexOf("]")
                  );
                  var remainingString = _matchLink[j]
                    .substring(_matchLink[j].indexOf("]") + 1)
                    .trim();
                  var _linkLink = remainingString.substring(
                    1,
                    remainingString.lastIndexOf(")")
                  );
                  _linkLink = _linkLink.replace(/\\n/g, "%0A");
                  if (hyperLinksMap) {
                    var _randomKey =
                      "korerandom://" + Object.keys(hyperLinksMap).length;
                    hyperLinksMap[_randomKey] = _linkLink;
                    _linkLink = _randomKey;
                  }
                  _linkLink =
                    '<span class="isLink"><a id="linkEvent" href="' +
                    _linkLink +
                    '" target="underscoreblank">' +
                    helpers.checkMarkdowns(_linkTxt) +
                    "</a></span>";
  
                  txtArr[i] = txtArr[i].replace(_matchLink[j], _linkLink);
                }
              }
              // Matches bold markup *test* doesnot match * test *, * test*. If all these are required then replace \S with \s
              var _matchAstrik = txtArr[i].match(/\*\S([^*]*?)\*/g);
              if (_matchAstrik && _matchAstrik.length > 0) {
                for (j = 0; j < _matchAstrik.length; j++) {
                  var _boldTxt = _matchAstrik[j];
                  var validBoldGroup = true;
                  if (chatInitialize.includes(_boldTxt, "*")) {
                    var _tempStr = _boldTxt.replace(/\*/g, "");
                    // var letterNumber = /^[0-9a-zA-Z!@#$%^&()_ +\-=\[\]{};':"\\|,.<>\/?]+$/;
                    if (!(_tempStr && _tempStr.length)) {
                      validBoldGroup = false;
                    }
                  }
                  if (validBoldGroup) {
                    _boldTxt = _boldTxt.substring(1, _boldTxt.length - 1);
                    _boldTxt = "<b>" + _boldTxt.trim() + "</b>";
                    txtArr[i] = txtArr[i].replace(_matchAstrik[j], _boldTxt);
                  }
                }
              }
              //For backward compatability who used ~ for Italics
              //Matches italic markup ~test~ doesnot match ~ test ~, ~test ~, ~ test~. If all these are required then replace \S with \s
              var _matchItalic = txtArr[i].match(/\~\S([^*]*?)\S\~/g);
              if (_matchItalic && _matchItalic.length > 0) {
                for (j = 0; j < _matchItalic.length; j++) {
                  var _italicTxt = _matchItalic[j];
                  if (
                    txtArr[i].indexOf(_italicTxt) === 0 ||
                    txtArr[i][txtArr[i].indexOf(_italicTxt) - 1] === " " ||
                    txtArr[i].indexOf(_italicTxt) !== -1
                  ) {
                    _italicTxt = _italicTxt.substring(1, _italicTxt.length - 1);
                    _italicTxt =
                      '<i class="markdownItalic">' + _italicTxt + "</i>";
                    txtArr[i] = txtArr[i].replace(_matchItalic[j], _italicTxt);
                  }
                }
              }
              // Matches italic markup _test_ doesnot match _ test _, _test _, _ test_. If all these are required then replace \S with \s
              var _matchItalic = txtArr[i].match(/\_\S([^*]*?)\S\_/g);
              if (_matchItalic && _matchItalic.length > 0) {
                for (j = 0; j < _matchItalic.length; j++) {
                  var _italicTxt = _matchItalic[j];
                  if (
                    txtArr[i].indexOf(_italicTxt) === 0 ||
                    txtArr[i][txtArr[i].indexOf(_italicTxt) - 1] === " " ||
                    txtArr[i].indexOf(_italicTxt) !== -1
                  ) {
                    var validItalicMark = true;
                    if (
                      txtArr[i][txtArr[i].indexOf(_italicTxt) + _italicTxt.length]
                    ) {
                      if (
                        txtArr[i][
                          txtArr[i].indexOf(_italicTxt) + _italicTxt.length
                        ] !== " "
                      ) {
                        validItalicMark = false;
                      }
                    }
                    if (validItalicMark) {
                      _italicTxt =
                        _italicTxt.substring(1, _italicTxt.length - 1) + " ";
                      _italicTxt =
                        '<i class="markdownItalic">' + _italicTxt + "</i>";
                      txtArr[i] = txtArr[i].replace(_matchItalic[j], _italicTxt);
                    }
                  }
                }
              }
              // Matches bold markup ~test~ doesnot match ~ test ~, ~test ~, ~ test~. If all these are required then replace \S with \s
              var _matchItalic = txtArr[i].match(/\~\S([^*]*?)\S\~/g);
              if (_matchItalic && _matchItalic.length > 0) {
                for (j = 0; j < _matchItalic.length; j++) {
                  var _italicTxt = _matchItalic[j];
                  if (
                    txtArr[i].indexOf(_italicTxt) === 0 ||
                    txtArr[i][txtArr[i].indexOf(_italicTxt) - 1] === " " ||
                    txtArr[i].indexOf(_italicTxt) !== -1
                  ) {
                    _italicTxt = _italicTxt.substring(1, _italicTxt.length - 1);
                    _italicTxt =
                      '<i class="markdownItalic">' + _italicTxt + "</i>";
                    txtArr[i] = txtArr[i].replace(_matchItalic[j], _italicTxt);
                  }
                }
              }
              // Matches bold markup ~test~ doesnot match ~ test ~, ~test ~, ~ test~. If all these are required then replace \S with \s
              var _matchPre = txtArr[i].match(/\`\`\`\S([^*]*?)\S\`\`\`/g);
              var _matchPre1 = txtArr[i].match(/\'\'\'\S([^*]*?)\S\'\'\'/g);
              if (_matchPre && _matchPre.length > 0) {
                for (j = 0; j < _matchPre.length; j++) {
                  var _preTxt = _matchPre[j];
                  _preTxt = _preTxt.substring(3, _preTxt.length - 3);
                  _preTxt = "<pre>" + _preTxt + "</pre>";
                  txtArr[i] = txtArr[i].replace(_matchPre[j], _preTxt);
                }
                _lineBreakAdded = true;
              }
              if (_matchPre1 && _matchPre1.length > 0) {
                for (j = 0; j < _matchPre1.length; j++) {
                  var _preTxt = _matchPre1[j];
                  _preTxt = _preTxt.substring(3, _preTxt.length - 3);
                  _preTxt = "<pre>" + _preTxt + "</pre>";
                  txtArr[i] = txtArr[i].replace(_matchPre1[j], _preTxt);
                }
                _lineBreakAdded = true;
              }
              if (!_lineBreakAdded && i > 0) {
                txtArr[i] = "\r\n" + txtArr[i];
              }
            }
            val = txtArr.join("");
            return val;
          },
        };
  
        function isEven(n) {
          n = Number(n);
          return n === 0 || !!(n && !(n % 2));
        }
        if (typeof Array.isArray === "undefined") {
          Array.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
          };
        }
        var previousValue;
        function multipleIndentation(txtArr, i, value) {
          var indentIndex;
          var paragraphIndex;
          var actualValue;
          if (!value) {
            previousValue = txtArr[i].substring(8);
            txtArr[i] =
              '<div class="indent">' + txtArr[i].substring(8) + "</div>";
          } else {
            txtArr[i] = '<div class="indent">' + txtArr[i] + "</div>";
            if (previousValue.indexOf("&gt;&gt;") === -1) {
              indentIndex = txtArr[i].indexOf("&gt;&gt;");
              paragraphIndex = txtArr[i].indexOf("</div>");
              actualValue = txtArr[i].slice(indentIndex, paragraphIndex);
              txtArr[i] = txtArr[i].replace(actualValue, previousValue);
            }
          }
          if (previousValue.indexOf("&gt;&gt;") === 0) {
            previousValue = previousValue.substring(8);
            multipleIndentation(txtArr, i, true);
          }
        }
        function extend() {
          var rec = function (obj) {
            var recRes = {};
            if (typeof obj === "object" && !Array.isArray(obj)) {
              for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                  if (typeof obj[key] === "object") {
                    recRes[key] = rec(obj[key]);
                  } else {
                    recRes[key] = obj[key];
                  }
                }
              }
              return recRes;
            } else {
              return obj;
            }
          };
          for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
              if (arguments[i].hasOwnProperty(key)) {
                if (typeof arguments[i][key] === "object") {
                  arguments[0][key] = rec(arguments[i][key]);
                } else {
                  arguments[0][key] = arguments[i][key];
                }
              }
            }
          }
          return arguments[0];
        }
  
        function chatWindow(cfg) {
          this.setPrivateVarToContext(this);
          isRecordingStarted = false;
          cfg.botOptions.test = false;
          this.config = {
            chatTitle: "Kore.ai Bot Chat",
            container: "body",
            allowIframe: false,
            botOptions: cfg.botOptions,
          };
          koreAPIUrl = cfg.botOptions.koreAPIUrl;
          bearerToken = cfg.botOptions.bearer;
          //speechServerUrl = cfg.botOptions.speechSocketUrl;
          speechPrefixURL = cfg.botOptions.koreSpeechAPIUrl;
          ttsServerUrl = cfg.botOptions.ttsSocketUrl;
          userIdentity = cfg.botOptions.userIdentity;
          if (
            cfg.botOptions.recorderWorkerPath &&
            cfg.botOptions.recorderWorkerPath.trim().length > 0
          ) {
            recorderWorkerPath = cfg.botOptions.recorderWorkerPath.trim();
          }
          if (cfg && cfg.chatContainer) {
            delete cfg.chatContainer;
          }
          this.config = extend(this.config, cfg);
          this.reWriteWebHookURL(this.config);
          window._chatHistoryLoaded = false;
          this.init();
          updateOnlineStatus();
          addBottomSlider();
          window.addEventListener("online", updateOnlineStatus);
          window.addEventListener("offline", updateOnlineStatus);
          attachEventListener();
        }
        //converts v1 webhooks url to v2 automatically
        chatWindow.prototype.reWriteWebHookURL = function (chatConfig) {
          if (
            chatConfig.botOptions &&
            chatConfig.botOptions.webhookConfig &&
            chatConfig.botOptions.webhookConfig.apiVersion &&
            chatConfig.botOptions.webhookConfig.apiVersion === 2
          ) {
            if (
              chatConfig.botOptions &&
              chatConfig.botOptions.webhookConfig &&
              chatConfig.botOptions.webhookConfig.webhookURL
            ) {
              chatConfig.botOptions.webhookConfig.webhookURL =
                chatConfig.botOptions.webhookConfig.webhookURL.replace(
                  "hooks",
                  "v2/webhook"
                );
            }
          }
        };
        // iframe of child window events //
        function attachEventListener() {
          // Create IE + others compatible event handler
          var eventMethod = window.addEventListener
            ? "addEventListener"
            : "attachEvent";
          var eventer = window[eventMethod];
          var messageEvent =
            eventMethod == "attachEvent" ? "onmessage" : "message";
          // Listen to message from child window
          eventer(
            messageEvent,
            function (e) {
              if (e.data && e.data.event) {
                var data = e.data;
                switch (data.event) {
                  case "formEvent":
                    formAction(e.data);
                    break;
                  default:
                    break;
                }
              }
            },
            false
          );
        }
        function postMessageToChildIframes(iframe, postPayload) {
          if (
            iframe &&
            iframe.length &&
            iframe[0] &&
            iframe[0].contentWindow &&
            postPayload
          ) {
            iframe[0].contentWindow.postMessage(postPayload, "*");
          }
        }
        // iframe of child window events ends//
  
        // inline model for iframes starts here//
        function closeChatModal() {
          if ($("#chatBodyModal").length) {
            $("#chatBodyModal").hide();
          }
          $(".kore-chat-window").removeClass("modelOpen");
          try {
            if (koreAriaUtilis) {
              koreAriaUtilis.closeDialog(
                document.getElementById("closeChatBodyModal")
              );
            }
          } catch (e) {}
        }
        function openModal(template, showClose) {
          var chatBodyModal = $("#chatBodyModal");
          var close = document.getElementsByClassName("closeChatBodyModal")[0];
          close.onclick = function () {
            $(".kore-chat-window").removeClass("modelOpen");
            var postPayload = {
              payload: {},
              event: "formEvent", // need to find another way to make it common ,giving a static value due to time constrain //
              action: "formCancel",
              metaData: {},
            };
            var iframe = chatBodyModal.find("iframe");
            postMessageToChildIframes(iframe, postPayload);
          };
          if (template) {
            chatBodyModal.find(".closeChatBodyModal").css("display", "none");
            chatBodyModal.find(".loading_form").css("z-index", 999);
            if (chatBodyModal && chatBodyModal.length) {
              chatBodyModal.find("#chatBodyModalContent").empty();
              chatBodyModal.find("#chatBodyModalContent").append(template);
              chatBodyModal.show();
              $(".kore-chat-window").addClass("modelOpen");
            }
            setTimeout(function () {
              chatBodyModal.find(".loading_form").css("z-index", 0);
              if (showClose) {
                chatBodyModal.find(".closeChatBodyModal").css("display", "block");
              } else {
                chatBodyModal.find(".closeChatBodyModal").css("display", "none");
              }
            }, 1500);
          } else {
            $(".kore-chat-window").removeClass("modelOpen");
            chatBodyModal.find(".closeChatBodyModal").css("display", "none");
            setTimeout(function () {
              chatBodyModal.find("#chatBodyModalContent").empty();
            }, 1000);
            closeChatModal();
          }
        }
        // inline model for iframes starts ends//
  
        // form event actions starts here //
        function formAction(event) {
          if (event && event.action === "formSubmit") {
            openModal();
            if ($(".kore-chat-body .uiformComponent").length) {
              $(".kore-chat-body .uiformComponent")
                .closest(".inlineIframeContainer")
                .css("display", "none");
            }
          } else if (event.action === "formCancel") {
            closeChatModal();
            if ($(".kore-chat-body .uiformComponent").length) {
              $(".kore-chat-body .uiformComponent")
                .closest(".inlineIframeContainer")
                .css("display", "none");
            }
          } else if (event.action === "formClose") {
            openModal();
            if ($(".kore-chat-body .uiformComponent").length) {
              $(".kore-chat-body .uiformComponent")
                .closest(".inlineIframeContainer")
                .css("display", "none");
            }
          }
        }
        chatWindow.prototype.renderWebForm = function (msgData, returnTemplate) {
          var me = this;
          if (
            msgData.message &&
            msgData.message[0].component &&
            msgData.message[0].component.payload &&
            msgData.message[0].component.payload.formData
          ) {
            msgData.renderType =
              msgData.message[0].component.payload.formData.renderType;
            msgData.message[0].component.payload.template_type = "iframe";
            if (!returnTemplate && msgData.renderType === "inline") {
              this.renderMessage(msgData);
            } else {
              var popupHtml = $(this.getChatTemplate("iframe")).tmpl({
                msgData: msgData,
                helpers: me.helpers,
                link_url: msgData.message[0].component.payload.formData.formLink,
              });
              if (returnTemplate) {
                return popupHtml;
              } else {
                openModal(popupHtml[0], true);
              }
            }
          }
        };
        // form event actions ends here //
        function addBottomSlider() {
          $(".kore-chat-window").remove(".kore-action-sheet");
          var actionSheetTemplate =
            '<div class="kore-action-sheet hide">\
              <div class="actionSheetContainer"></div>\
              </div>';
          $(".kore-chat-window").append(actionSheetTemplate);
        }
        function updateOnlineStatus() {
          if ("boolean" === typeof navigator["onLine"]) {
            if (navigator.onLine) {
              this.hideError();
              if (bot && bot.RtmClient) {
                bot.getHistory({ forHistorySync: true, limit: 30 });
              }
            } else {
              this.showError("You are currently offline");
            }
          }
        }
  
        chatWindow.prototype.resetPingMessage = function () {
          var me = this;
          clearTimeout(me._pingTimer);
          me._pingTimer = setTimeout(function () {
            var messageToBot = {};
            messageToBot["type"] = "ping";
            me.bot.sendMessage(messageToBot, function messageSent() {});
            me.resetPingMessage();
          }, me._pingTime);
        };
        window.onresize = function (event) {
          var me = chatInitialize;
          if (event.target === window) {
            chatInitialize.setCollapsedModeStyles();
            var _width = $("#chatContainer").width() - 480;
            //$('.kore-chat-window').attr('style','left: '+_width+'+px');
          }
          if (
            $(".kore-chat-window").width() > 480 ||
            (document.getElementsByClassName("kore-chat-window").length &&
              document
                .getElementsByClassName("kore-chat-window")[0]
                .classList.contains("expanded"))
          ) {
            var _koreChatWindowHeight = $(".kore-chat-window").width();
            $(".carousel").attr(
              "style",
              "width: " + (_koreChatWindowHeight - 85) + "px !important"
            );
          } else {
            $(".carousel").attr("style", "width: 300px !important");
          }
          for (var i = 0; i < carouselEles.length; i++) {
            carouselEles[i].computeResize();
          }
  
          // handling quick replies
          var quickReplyDivs = document.querySelectorAll(".quickReplies");
          for (var i = 0; i < quickReplyDivs.length; i++) {
            var btnsParentDiv = quickReplyDivs[i].querySelectorAll(
              ".quick_replies_btn_parent"
            );
            var leftScrollBtn = quickReplyDivs[i].querySelectorAll(
              ".quickreplyLeftIcon"
            );
            var rightScrollBtn = quickReplyDivs[i].querySelectorAll(
              ".quickreplyRightIcon"
            );
            if (btnsParentDiv[0].hasChildNodes()) {
              if (btnsParentDiv[0].scrollLeft > 0) {
                leftScrollBtn[0].classList.remove("hide");
              } else {
                leftScrollBtn[0].classList.add("hide");
              }
              if (btnsParentDiv[0].offsetWidth < btnsParentDiv[0].scrollWidth) {
                rightScrollBtn[0].classList.remove("hide");
              } else {
                rightScrollBtn[0].classList.add("hide");
              }
            }
          }
  
          /* Handling for full size table */
          if ($(".kore-chat-window").width() > 460) {
            $(".accordionTable").each(function () {
              if ($(this).hasClass("responsive")) {
                $(this).addClass("hide");
              }
            });
            $(".tablechartDiv").each(function () {
              if (!$(this).hasClass("regular")) {
                $(this).removeClass("hide");
              }
            });
          } else {
            $(".accordionTable").each(function () {
              if ($(this).hasClass("responsive")) {
                $(this).removeClass("hide");
              }
            });
            $(".tablechartDiv").each(function () {
              if (!$(this).hasClass("regular")) {
                $(this).addClass("hide");
              }
            });
          }
          /* Handling for table ends*/
          /* Handling expand and collapse chat-container height */
          $(".chat-container").scrollTop($(".chat-container")[0].scrollHeight);
          if (me.chatPSObj && me.chatPSObj.update) {
            me.chatPSObj.update();
          }
          /* Handling expand and collapse chat-container height */
        };
        chatWindow.prototype.handleImagePreview = function () {
          var modal = document.getElementById("myModal");
  
          // Get the image and insert it inside the modal - use its "alt" text as a caption
          var img = document.getElementById("myImg");
          var modalImg = document.getElementById("img01");
          var captionText = document.getElementById("caption");
          if (document.querySelectorAll(".messageBubble img").length > 0) {
            for (
              var i = 0;
              i < document.querySelectorAll(".messageBubble img").length;
              i++
            ) {
              var evt = document.querySelectorAll(".messageBubble img")[i];
              evt.addEventListener("click", function (e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                modal.style.display = "block";
                var image = $(modal).find(".image-preview")[0];
                modalImg.src = this.src;
                captionText.innerHTML = this.alt;
                var scale = 1,
                  panning = false,
                  pointX = 0,
                  pointY = 0,
                  start = { x: 0, y: 0 },
                  zoom = document.getElementById("zoom");
  
                function setTransform(type) {
                  if (type) {
                    $(image)
                      .find(".modal-content-imagePreview")
                      .css({ transform: "scale(" + scale + ")" });
                  } else {
                    $(image).find(
                      ".modal-content-imagePreview"
                    )[0].style.transform =
                      "translate(" +
                      pointX +
                      "px, " +
                      pointY +
                      "px) scale(" +
                      scale +
                      ")";
                  }
                }
  
                image.onmousedown = function (e) {
                  e.preventDefault();
                  start = { x: e.clientX - pointX, y: e.clientY - pointY };
                  panning = true;
                };
  
                image.onmouseup = function (e) {
                  panning = false;
                };
  
                image.onmousemove = function (e) {
                  e.preventDefault();
                  if (!panning) {
                    return;
                  }
                  pointX = e.clientX - start.x;
                  pointY = e.clientY - start.y;
                  setTransform();
                };
  
                image.onwheel = function (e) {
                  e.preventDefault();
                  var xs = (e.clientX - pointX) / scale,
                    ys = (e.clientY - pointY) / scale,
                    delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
                  delta > 0 ? (scale *= 1.2) : (scale /= 1.2);
                  pointX = e.clientX - xs * scale;
                  pointY = e.clientY - ys * scale;
  
                  setTransform("onwheen");
                };
              });
            }
          }
  
          /*img.onclick = function(){
                      modal.style.display = "block";
                      modalImg.src = this.src;
                      captionText.innerHTML = this.alt;
                  }*/
  
          // Get the <span> element that closes the modal
          var span = document.getElementsByClassName("closeImagePreview")[0];
  
          // When the user clicks on <span> (x), close the modal
          span.onclick = function () {
            modal.style.display = "none";
            $(modal)
              .find(".modal-content-imagePreview")
              .css({ transform: "none" });
          };
        };
        chatWindow.prototype.isMobile = function () {
          try {
            var isMobile =
              /iphone|ipod|android|blackberry|fennec/.test(
                navigator.userAgent.toLowerCase()
              ) || window.screen.width <= 480;
            return isMobile;
          } catch (e) {
            return false;
          }
        };
        chatWindow.prototype.setCollapsedModeStyles = function () {
          $(".kore-chat-window").css({
            left: $("body").width() - 480,
            width: "480px",
          });
        };
        chatWindow.prototype.setLocalStoreItem = function (key, value) {
          var me = this;
          var storage = me.getStoreTypeByKey(key);
          return window[storage].setItem(key, value);
        };
        chatWindow.prototype.getLocalStoreItem = function (key) {
          var me = this;
          var storage = me.getStoreTypeByKey(key);
          return window[storage].getItem(key);
        };
        chatWindow.prototype.removeLocalStoreItem = function (key) {
          var me = this;
          var storage = me.getStoreTypeByKey(key);
          return window[storage].removeItem(key);
        };
        chatWindow.prototype.getStoreTypeByKey = function (key) {
          var me = this;
          var storage = "localStorage";
          if (key === "kr-cw-uid") {
            storage = me.config.multiPageApp.chatWindowStateStore;
          } else if (key === "kr-cw-uid") {
            storage = me.config.multiPageApp.userIdentityStore;
          }
          return storage;
        };
        chatWindow.prototype.init = function () {
          var meForMessageEvent = this;
          invokeBotFromHostWebsite(meForMessageEvent);
          var me = this;
          me.initi18n();
          me.seti18n(
            (me.config && me.config.i18n && me.config.i18n.defaultLanguage) ||
              "en"
          );
          if (
            me.config &&
            me.config.sendFailedMessage &&
            me.config.sendFailedMessage.hasOwnProperty("MAX_RETRIES")
          ) {
            sendFailedMessage.MAX_RETRIES =
              me.config.sendFailedMessage.MAX_RETRIES;
          }
          window.chatContainerConfig = me;
          me.config.botOptions.botInfo.name = this.escapeHTML(
            me.config.botOptions.botInfo.name
          );
          me._botInfo = me.config.botOptions.botInfo;
          me.config.botOptions.botInfo = {
            chatBot: me._botInfo.name,
            taskBotId: me._botInfo._id,
            customData: me._botInfo.customData,
            metaTags: me._botInfo.metaTags,
            tenanturl: me._botInfo.tenanturl,
          };
          var tempTitle = me._botInfo.name;
          me.config.chatTitle = me.config.botMessages.connecting;
          if (me.config.multiPageApp && me.config.multiPageApp.enable) {
            var cwState = me.getLocalStoreItem("kr-cw-state");
            var maintainContext = cwState ? true : false;
            if (maintainContext && me.getLocalStoreItem("kr-cw-uid")) {
              me.config.botOptions.userIdentity = userIdentity =
                me.getLocalStoreItem("kr-cw-uid");
            }
            me.config.botOptions.maintainContext = maintainContext;
          }
          me.config.userAgentIE = navigator.userAgent.indexOf("Trident/") !== -1;
          var mobileBrowserOpened = me.isMobile();
          if (mobileBrowserOpened) {
            me.config.isSendButton = true;
          }
          me.config.ttsInterface = me.config.ttsInterface || "webapi";
          me.loadHistory = me.config.loadHistory || false;
          me.historyLoading = me.loadHistory ? true : false;
          me.config.botOptions.loadHistory = me.config.loadHistory;
          me.config.botOptions.chatHistory = me.config.chatHistory;
          me.config.botOptions.handleError = me.config.handleError;
          me.config.botOptions.googleMapsAPIKey = me.config.googleMapsAPIKey;
          /* autoEnableSpeechAndTTS will on if and only if both tts and mic are enabled */
          if (
            me.config.isTTSEnabled &&
            me.config.isSpeechEnabled &&
            me.config.autoEnableSpeechAndTTS
          ) {
            me.isTTSOn = true;
            setTimeout(function () {
              $(".ttspeakerDiv").removeClass("ttsOff");
            }, 350);
          }
          var chatWindowHtml = $(me.getChatTemplate()).tmpl(me.config);
          me.config.chatContainer = chatWindowHtml;
          me.updatei18nDirection();
  
          me.config.chatTitle = tempTitle;
          if (!me.config.minimizeMode) {
            me.bot.init(me.config.botOptions, me.config.messageHistoryLimit);
            if (me.config.multiPageApp && me.config.multiPageApp.enable) {
              me.setLocalStoreItem("kr-cw-state", "open");
              me.setLocalStoreItem(
                "kr-cw-uid",
                me.config.botOptions.userIdentity
              );
              setTimeout(function () {
                if (cwState === "minimized") {
                  $(".kore-chat-window button.minimize-btn").trigger("click");
                }
              }, 500);
            }
          } else {
            // fn call to Notify the parent when the chatbot is minimized
            minimizeChatbot(me.config.botOptions);
            chatWindowHtml.addClass("minimize");
            chatWindowHtml
              .find(".minimized-title")
              // .html("Talk to " + me.config.chatTitle);
            me.skipedInit = true;
            if (
              me.config.multiPageApp &&
              me.config.multiPageApp.enable &&
              maintainContext
            ) {
              setTimeout(function () {
                if (cwState === "open") {
                  $(".kore-chat-window .minimized .messages").trigger("click");
                } else if (cwState === "minimized") {
                  $(".kore-chat-window .minimized .messages").trigger("click");
                  $(".kore-chat-window button.minimize-btn").trigger("click");
                }
              }, 500);
            }
          }
          if (me.config.allowLocation) {
            me.bot.fetchUserLocation();
          }
          me.render(chatWindowHtml);
          me.unfreezeUIOnHistoryLoadingFail.call(me);
        };
        chatWindow.prototype.initi18n = function () {
          var me = this;
          me.i18n = {
            selectedLanguage: "en",
            rtlLanguages: [], //loads from i18n config
            langFiles: {
              en: {
                message: "Your Message...",
                connecting: "Connecting...",
                reconnecting: "Reconnecting...",
                entertosend: "Press enter to send",
                endofchat: "End of chat history",
                loadinghistory: "Loading chat history..",
                sendText: "Send",
                closeText: "Close",
                expandText: "Expand",
                minimizeText: "Minimize",
                reconnectText: "Reconnect",
                attachmentText: "Attachment",
              },
            },
          };
          if (me.config && me.config.i18n && me.config.i18n.languageStrings) {
            me.i18n.langFiles = extend(
              me.i18n.langFiles,
              me.config.i18n.languageStrings
            );
          }
          if (me.config && me.config.i18n && me.config.i18n.rtlLanguages) {
            me.i18n.rtlLanguages = extend(
              me.i18n.rtlLanguages,
              me.config.i18n.rtlLanguages
            );
          }
        };
        chatWindow.prototype.seti18n = function (lang) {
          var me = this;
          me.i18n.selectedLanguage = lang;
          me.config.botMessages = botMessages =
            me.i18n.langFiles[me.i18n.selectedLanguage];
          botMessages.availableLanguages =
            (me.config.i18n && me.config.i18n.availableLanguages) || false;
          botMessages.selectedLanguage = me.i18n.selectedLanguage;
  
          if (me.config.chatContainer) {
            var chatEle = me.config.chatContainer;
            chatEle.find(".endChatContainerText").html(botMessages.endofchat);
  
            chatEle.find(".close-btn").attr("title", botMessages.closeText);
            chatEle.find(".expand-btn").attr("title", botMessages.expandText);
            chatEle.find(".minimize-btn").attr("title", botMessages.minimizeText);
            chatEle.find(".reload-btn").attr("title", botMessages.reconnectText);
            chatEle
              .find(".sdkAttachment.attachmentBtn")
              .attr("title", botMessages.attachmentText);
  
            chatEle
              .find(".chatInputBox")
              .attr("placeholder", botMessages.message);
            //chatEle.find('.sendButton').html(botMessages.sendText);
            // chatEle.find('.chatSendMsg').html(botMessages.entertosend);
            chatEle.find(".chatSendMsg").html("");
          }
        };
        chatWindow.prototype.updatei18nDirection = function () {
          var me = this;
          if (me.i18n.rtlLanguages.indexOf(me.i18n.selectedLanguage) > -1) {
            me.config.chatContainer.attr("dir", "rtl");
          } else {
            me.config.chatContainer.attr("dir", "ltr");
          }
        };
        chatWindow.prototype.setPrivateVarToContext = function (_this) {
          (_this.messagesQueue = messagesQueue),
            (_this.historyLoading = historyLoading),
            (_this.loadHistory = loadHistory);
          _this.accessToken = accessToken;
          _this.bot = bot;
          //_this._chatContainer =  _this.config.chatContainer;
          _this.EVENTS = EVENTS;
          _this.chatInitialize = chatInitialize;
          _this.botMessages = botMessages;
          _this.attachmentInfo = attachmentInfo;
          _this._botInfo = _botInfo;
          _this.customTemplateObj = customTemplateObj;
          _this.helpers = helpers;
          _this._pingTimer = _pingTimer;
          _this._pingTime = _pingTime;
        };
        chatWindow.prototype.destroy = function () {
          var me = this;
          $(".kore-chat-overlay").hide();
          me.bot.close();
          if (!me.config.minimizeMode) {
            me.bot.destroy();
          }
          me.messagesQueue = [];
          if (me.config && me.config.chatContainer) {
            if (!me.config.minimizeMode) {
              me.config.chatContainer.remove();
            } else {
              me.config.chatContainer
                .find(".kore-chat-header .header-title")
                .html(me.config.botMessages.reconnecting);
              me.config.chatContainer.addClass("minimize");
              me.skipedInit = true;
            }
          }
          if (ttsAudioSource) {
            ttsAudioSource.stop();
          }
          me.isTTSOn = false;
          if (_ttsContext) {
            _ttsContext.close();
            _ttsContext = null;
          }
        };
  
        chatWindow.prototype.resetWindow = function () {
          var me = this;
          me.config.chatContainer
            .find(".kore-chat-header .header-title")
            .html(me.config.botMessages.reconnecting);
          //me.config.chatContainer.find('.chat-container').html("");
          me.bot.close();
          me.config.botOptions.maintainContext = false;
          me.setLocalStoreItem("kr-cw-uid", me.config.botOptions.userIdentity);
          me.bot.init(me.config.botOptions);
        };
  
        chatWindow.prototype.bindEvents = function () {
          var me = this;
          me.bindCustomEvents();
          var _chatContainer = me.config.chatContainer;
          _chatContainer
            .draggable({
              handle: _chatContainer.find(".kore-chat-header .header-title"),
              containment: "document",
            })
            .resizable({
              handles: "n, e, w, s",
              containment: "document",
              minWidth: 480,
            });
          _chatContainer
            .off("keyup", ".chatInputBox")
            .on("keyup", ".chatInputBox", function (event) {
              var _footerContainer = $(me.config.container).find(
                ".kore-chat-footer"
              );
              var _bodyContainer = $(me.config.container).find(".kore-chat-body");
              _bodyContainer.css("bottom", _footerContainer.outerHeight());
              me.prevComposeSelection = window.getSelection();
              prevRange =
                me.prevComposeSelection.rangeCount > 0 &&
                me.prevComposeSelection.getRangeAt(0);
              if (this.innerText.length > 0) {
                _chatContainer
                  .find(".chatInputBoxPlaceholder")
                  .css("display", "none");
                _chatContainer.find(".sendButton").removeClass("disabled");
              } else {
                _chatContainer
                  .find(".chatInputBoxPlaceholder")
                  .css("display", "block");
                _chatContainer.find(".sendButton").addClass("disabled");
              }
            });
          _chatContainer.on(
            "click",
            ".chatInputBoxPlaceholder",
            function (event) {
              _chatContainer.find(".chatInputBox").trigger("click");
              _chatContainer.find(".chatInputBox").trigger("focus");
            }
          );
          _chatContainer.on("change", ".lang-selector", function (e) {
            var selectedValue = $(e.target).val();
            me.seti18n(selectedValue);
            me.updatei18nDirection();
          });
          _chatContainer.on("click", ".chatInputBox", function (event) {
            me.prevComposeSelection = window.getSelection();
            prevRange =
              me.prevComposeSelection.rangeCount > 0 &&
              me.prevComposeSelection.getRangeAt(0);
          });
          _chatContainer.on("blur", ".chatInputBox", function (event) {
            _escPressed = 0;
          });
          _chatContainer
            .off("click", ".botResponseAttachments")
            .on("click", ".botResponseAttachments", function (event) {
              var thisEle = this;
              if ($(event.currentTarget).attr("download") === "true") {
                var dlink = document.createElement("a");
                dlink.download = $(event.currentTarget)
                  .find(".botuploadedFileName")
                  .text();
                dlink.href = $(thisEle).attr("fileid");
                dlink.click();
                dlink.remove();
              } else {
                window.open($(thisEle).attr("fileid"), "_blank");
              }
            });
          /*_chatContainer.off('click', '.attachments').on('click', '.attachments', function (event) {
                      var attachFileID = $(this).attr('fileid');
                      var auth = (bearerToken) ? bearerToken : assertionToken;
                      $.ajax({
                          type: "GET",
                          url: koreAPIUrl + "1.1/attachment/file/" + attachFileID + "/url",
                          headers: {
                              Authorization: auth
                          },
                          success: function (response) {
                              var downloadUrl = response.fileUrl;
                              if (downloadUrl.indexOf("?") < 0) {
                                  downloadUrl += "?download=1";
                              } else {
                                  downloadUrl += "&download=1";
                              }
          
                              var save = document.createElement('a');
                              document.body.appendChild(save);
                              save.href = downloadUrl;
                              save.target = '_blank';
                              save.download = 'unknown file';
                              save.style.dislay = 'none !important;';
                              save.click();
                              save.remove();
                          },
                          error: function (msg) {
                              console.log("Oops, something went horribly wrong");
                          }
                      });
                  });*/
          _chatContainer
            .off("keydown", ".chatInputBox")
            .on("keydown", ".chatInputBox", function (event) {
              var _this = $(this);
              var _footerContainer = $(me.config.container).find(
                ".kore-chat-footer"
              );
              var _bodyContainer = $(me.config.container).find(".kore-chat-body");
              _bodyContainer.css("bottom", _footerContainer.outerHeight());
              if (event.keyCode === 13) {
                if (event.shiftKey) {
                  return;
                }
                if ($(".upldIndc").is(":visible")) {
                  alert("Uploading file, please wait...");
                  return;
                }
                if ($(".recordingMicrophone").is(":visible")) {
                  $(".recordingMicrophone").trigger("click");
                }
                event.preventDefault();
  
                me.sendMessage(_this, me.attachmentInfo);
                return;
              } else if (event.keyCode === 27) {
                _escPressed++;
                if (_escPressed > 1) {
                  _escPressed = 0;
                  stop();
                  this.innerText = "";
                  $(".attachment").empty();
                  fileUploaderCounter = 0;
                  setTimeout(function () {
                    setCaretEnd(document.getElementsByClassName("chatInputBox"));
                  }, 100);
                }
              }
            });
          _chatContainer
            .off("click", ".sendButton")
            .on("click", ".sendButton", function (event) {
              var _this = $(".chatInputBox");
              if ($(".upldIndc").is(":visible")) {
                alert("Uploading file, please wait...");
                return;
              }
              if ($(".recordingMicrophone").is(":visible")) {
                $(".recordingMicrophone").trigger("click");
              }
              event.preventDefault();
              me.sendMessage(_this, me.attachmentInfo);
              return;
            });
          _chatContainer
            .off("click", ".notRecordingMicrophone")
            .on("click", ".notRecordingMicrophone", function (event) {
              if (ttsAudioSource) {
                ttsAudioSource.stop();
              }
              if (me.config.isSpeechEnabled) {
                getSIDToken();
              }
            });
          _chatContainer
            .off("click", ".recordingMicrophone")
            .on("click", ".recordingMicrophone", function (event) {
              stop();
              setTimeout(function () {
                setCaretEnd(document.getElementsByClassName("chatInputBox"));
              }, 350);
            });
          _chatContainer
            .off("click", ".attachmentBtn")
            .on("click", ".attachmentBtn", function (event) {
              if (fileUploaderCounter == 1) {
                alert("You can upload only one file");
                return;
              }
              if ($(".upldIndc").is(":visible")) {
                alert("Uploading file, please wait...");
                return;
              }
              $("#captureAttachmnts").trigger("click");
            });
          _chatContainer
            .off("click", ".removeAttachment")
            .on("click", ".removeAttachment", function (event) {
              $(this).parents(".msgCmpt").remove();
              $(".kore-chat-window").removeClass("kore-chat-attachment");
              fileUploaderCounter = 0;
              me.attachmentInfo = {};
              $(".sendButton").addClass("disabled");
              document.getElementById("captureAttachmnts").value = "";
            });
          _chatContainer
            .off("change", "#captureAttachmnts")
            .on("change", "#captureAttachmnts", function (event) {
              var file = $("#captureAttachmnts").prop("files")[0];
              if (file && file.size) {
                if (file.size > filetypes.file.limit.size) {
                  alert(filetypes.file.limit.msg);
                  return;
                }
              }
              cnvertFiles(this, file);
            });
          _chatContainer
            .off("paste", ".chatInputBox")
            .on("paste", ".chatInputBox", function (event) {
              event.preventDefault();
              var _this = document.getElementsByClassName("chatInputBox");
              var _clipboardData =
                event.clipboardData ||
                (event.originalEvent && event.originalEvent.clipboardData) ||
                window.clipboardData;
              var _htmlData = "";
              if (_clipboardData) {
                _htmlData = me.helpers.nl2br(
                  chatInitialize.escapeHTML(_clipboardData.getData("text")),
                  false
                );
                if (_htmlData) {
                  insertHtmlData(_this, _htmlData);
                }
              }
              setTimeout(function () {
                setCaretEnd(_this);
              }, 100);
            });
          _chatContainer
            .off("click", ".sendChat")
            .on("click", ".sendChat", function (event) {
              var _footerContainer = $(me.config.container).find(
                ".kore-chat-footer"
              );
              me.sendMessage(_footerContainer.find(".chatInputBox"));
            });
  
          _chatContainer.off("click", "li a").on("click", "li a", function (e) {
            e.preventDefault();
            var a_link = $(this).attr("href");
            var _trgt = $(this).attr("target");
            var msgDataText =
              $(event.currentTarget).closest("span.simpleMsg").attr("msgData") ||
              "";
            var msgData;
            if (msgDataText) {
              try {
                msgData = JSON.parse(msgDataText);
              } catch (err) {}
            }
            if (
              msgData &&
              msgData.message &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.formData
            ) {
              me.renderWebForm(msgData);
            } else if (_trgt === "_self") {
              callListener("provideVal", { link: a_link });
              return;
            }
            if (me.config.allowIframe === true) {
              var popupHtml = $(me.getChatTemplate("iframe")).tmpl({
                msgData: msgData,
                helpers: me.helpers,
                link_url: url,
              });
              popupHtml[0].onload = function (iFrameEvent) {
                console.log(iFrameEvent);
              };
              openModal(popupHtml[0], true);
            } else {
              me.openExternalLink(a_link);
            }
          });
          _chatContainer
            .off(
              "click",
              ".buttonTmplContentBox li,.listTmplContentChild .buyBtn,.viewMoreList .viewMore,.listItemPath,.quickReply,.carouselImageContent,.listRightContent,.checkboxBtn,.likeDislikeDiv,.buttonQuickReply"
            )
            .on(
              "click",
              ".buttonTmplContentBox li,.listTmplContentChild .buyBtn, .viewMoreList .viewMore,.listItemPath,.quickReply,.carouselImageContent,.listRightContent,.checkboxBtn,.likeDislikeDiv,.buttonQuickReply",
              function (e) {
                e.preventDefault();
                e.stopPropagation();
                var type = $(this).attr("type");
                if (type) {
                  type = type.toLowerCase();
                }
                if (type == "postback" || type == "text") {
                  $(".chatInputBox").text(
                    $(this).attr("actual-value") || $(this).attr("value")
                  );
                  //var _innerText = $(this)[0].innerText.trim() || $(this).attr('data-value').trim();
                  var _innerText =
                    $(this)[0] && $(this)[0].innerText
                      ? $(this)[0].innerText.trim()
                      : "" || ($(this) && $(this).attr("data-value"))
                      ? $(this).attr("data-value").trim()
                      : "";
                  me.sendMessage($(".chatInputBox"), _innerText);
                } else if (type == "url" || type == "web_url") {
                  if ($(this).attr("msgData") !== undefined) {
                    var msgData;
                    try {
                      msgData = JSON.parse($(this).attr("msgData"));
                    } catch (err) {}
                    if (
                      msgData &&
                      msgData.message &&
                      msgData.message[0].component &&
                      (msgData.message[0].component.formData ||
                        (msgData.message[0].component.payload &&
                          msgData.message[0].component.payload.formData))
                    ) {
                      if (msgData.message[0].component.formData) {
                        msgData.message[0].component.payload.formData =
                          msgData.message[0].component.formData;
                      }
                      me.renderWebForm(msgData);
                      return;
                    }
                  }
                  var a_link = $(this).attr("url");
                  if (
                    a_link.indexOf("http:") < 0 &&
                    a_link.indexOf("https:") < 0
                  ) {
                    a_link = "http:////" + a_link;
                  }
                  me.openExternalLink(a_link);
                }
                if (
                  e.currentTarget.classList &&
                  e.currentTarget.classList.length > 0 &&
                  e.currentTarget.classList[1] === "likeDiv"
                ) {
                  $(".likeImg").addClass("hide");
                  $(".likedImg").removeClass("hide");
                  $(".likeDislikeDiv").addClass("dummy");
                }
                if (
                  e.currentTarget.classList &&
                  e.currentTarget.classList.length > 0 &&
                  e.currentTarget.classList[1] === "disLikeDiv"
                ) {
                  $(".disLikeImg").addClass("hide");
                  $(".disLikedImg").removeClass("hide");
                  $(".likeDislikeDiv").addClass("dummy");
                }
  
                if (
                  e.currentTarget.classList &&
                  e.currentTarget.classList.length > 0 &&
                  e.currentTarget.classList[0] === "checkboxBtn"
                ) {
                  var checkboxSelection = $(
                    e.currentTarget.parentElement.parentElement
                  ).find(".checkInput:checked");
                  var selectedValue = [];
                  var toShowText = [];
                  for (var i = 0; i < checkboxSelection.length; i++) {
                    selectedValue.push($(checkboxSelection[i]).attr("value"));
                    toShowText.push($(checkboxSelection[i]).attr("text"));
                  }
                  $(".chatInputBox").text(
                    $(this).attr("title") + ": " + selectedValue.toString()
                  );
                  me.sendMessage($(".chatInputBox"), toShowText.toString());
                }
                if (
                  e.currentTarget.classList &&
                  e.currentTarget.classList.length > 0 &&
                  e.currentTarget.classList[0] === "quickReply"
                ) {
                  var _parentQuikReplyEle =
                    e.currentTarget.parentElement.parentElement;
                  var _leftIcon =
                    _parentQuikReplyEle.parentElement.parentElement.querySelectorAll(
                      ".quickreplyLeftIcon"
                    );
                  var _rightIcon =
                    _parentQuikReplyEle.parentElement.parentElement.querySelectorAll(
                      ".quickreplyRightIcon"
                    );
                  // setTimeout(function () {
                  //   _parentQuikReplyEle.parentElement.parentElement
                  //     .getElementsByClassName("user-account")[0]
                  //     .classList.remove("marginT50");
                  //   _parentQuikReplyEle.parentElement.parentElement.removeChild(
                  //     _leftIcon[0]
                  //   );
                  //   _parentQuikReplyEle.parentElement.parentElement.removeChild(
                  //     _rightIcon[0]
                  //   );
                  //   _parentQuikReplyEle.parentElement.removeChild(
                  //     _parentQuikReplyEle
                  //   );
                  // }, 50);
                }
                setTimeout(function () {
                  var _chatInput = _chatContainer.find(
                    ".kore-chat-footer .chatInputBox"
                  );
                  _chatInput.focus();
                }, 600);
              }
            );
  
          _chatContainer
            .off("click", ".close-btn")
            .on("click", ".close-btn", function (event) {
              // fn call to notify the parent when the chatbot is minimized
              minimizeChatbot(me.config.botOptions);
              //Added by sushil to clear botOption facing loggin issues text
              me.config.botOptions.botInfo.customData.facingIssueOnWeb =
              "deleted"
              $(".recordingMicrophone").trigger("click");
              if (ttsAudioSource) {
                ttsAudioSource.stop();
              }
              me.isTTSOn = false;
              me.destroy();
              if (_ttsContext) {
                _ttsContext.close();
                _ttsContext = null;
              }
  
              if (me.config.multiPageApp && me.config.multiPageApp.enable) {
                me.removeLocalStoreItem("kr-cw-state");
                me.removeLocalStoreItem("kr-cw-uid");
                me.config.botOptions.maintainContext = false;
              }
            });
  
          _chatContainer
            .off("click", ".minimize-btn")
            .on("click", ".minimize-btn", function (event) {
              // fn call to notify the parent when the chatbot is minimized
              minimizeChatbot(me.config.botOptions);
              if (me.config.multiPageApp && me.config.multiPageApp.enable) {
                me.setLocalStoreItem("kr-cw-state", "minimized");
              }
              if (me.minimized === true) {
                _chatContainer.removeClass("minimize");
                me.minimized = false;
                if (me.expanded === false) {
                  /*_chatContainer.draggable({
                                  handle: _chatContainer.find(".kore-chat-header .header-title"),
                                  containment: "window",
                                  scroll: false
                              });*/
                }
              } else {
                _chatContainer.addClass("minimize");
                if (
                  me.expanded === false &&
                  _chatContainer.hasClass("ui-draggable")
                ) {
                  //_chatContainer.draggable("destroy");
                }
                // _chatContainer.find('.minimized-title').html("Talk to " + me.config.chatTitle);
                me.minimized = true;
                if (me.expanded === true) {
                  $(".kore-chat-overlay").hide();
                }
              }
              $(".recordingMicrophone").trigger("click");
              if (ttsAudioSource) {
                ttsAudioSource.stop();
              }
            });
  
          _chatContainer
            .off("click", ".expand-btn")
            .on("click", ".expand-btn", function (event) {
              if ($(".kore-chat-overlay").length === 0) {
                $(me.config.container).append(
                  '<div class="kore-chat-overlay"></div>'
                );
              }
              if (me.expanded === true) {
                me.setCollapsedModeStyles();
                $(".kore-chat-overlay").hide();
                $(this).attr("title", "Expand");
                _chatContainer.removeClass("expanded");
                $(".expand-btn-span").removeClass("fa-compress");
                $(".expand-btn-span").addClass("fa-expand");
                me.expanded = false;
                $(".chat-container").scrollTop(
                  $(".chat-container")[0].scrollHeight
                );
                /* _chatContainer.draggable({
                               handle: _chatContainer.find(".kore-chat-header .header-title"),
                               containment: "parent",
                               scroll: false
                           }).resizable({
                               handles: "n, e, w, s",
                               containment: "html",
                               minWidth: 400
                           });*/
              } else {
                $(".kore-chat-overlay").show();
                $(this).attr("title", "Collapse");
                _chatContainer.addClass("expanded");
                $(".expand-btn-span").addClass("fa-compress");
                $(".expand-btn-span").removeClass("fa-expand");
                //_chatContainer.draggable("destroy").resizable("destroy");
                me.expanded = true;
              }
              var evt = document.createEvent("HTMLEvents");
              evt.initEvent("resize", true, false);
              window.dispatchEvent(evt);
              var container_pos_left =
                _chatContainer.position().left + _chatContainer.width();
              if (container_pos_left > $(window).width()) {
                _chatContainer.css(
                  "left",
                  _chatContainer.position().left -
                    (container_pos_left - $(window).width() + 10) +
                    "px"
                );
              }
              if (me.chatPSObj && me.chatPSObj.update) {
                me.chatPSObj.update();
              }
            });
  
          _chatContainer
            .off("click", ".retry")
            .on("click", ".retry", function (event) {
              var target = $(event.target);
              _chatContainer.find(".failed-text").remove();
              _chatContainer.find(".retry-icon").remove();
              _chatContainer.find(".retry-text").text("Retrying...");
              sendFailedMessage.messageId = target
                .closest(".fromCurrentUser")
                .attr("id");
              _chatContainer
                .find(".reload-btn")
                .trigger("click", { isReconnect: true });
            });
          /*$('body').on('click', '.kore-chat-overlay, .kore-chat-window .minimize-btn', function () {
                      if (me.expanded === true) {
                          $('.kore-chat-window .expand-btn').trigger('click');
                      }
                  });*/
  
          // dateClockPickers();
          if (window.KorePickers) {
            var pickerConfig = {
              chatWindowInstance: me,
              chatConfig: me.config,
            };
            var korePicker = new KorePickers(pickerConfig);
            korePicker.init();
          }
          $(document).on("keyup", function (evt) {
            if (evt.keyCode == 27) {
              $(".closeImagePreview").trigger("click");
              $(".closeElePreview").trigger("click");
            }
          });
          _chatContainer
            .off("click", ".quickreplyLeftIcon")
            .on("click", ".quickreplyLeftIcon", function (event) {
              var _quickReplesDivs =
                event.currentTarget.parentElement.getElementsByClassName(
                  "buttonTmplContentChild"
                );
              if (_quickReplesDivs.length) {
                var _scrollParentDiv =
                  event.target.parentElement.getElementsByClassName(
                    "quick_replies_btn_parent"
                  );
                var _totalWidth = _scrollParentDiv[0].scrollLeft;
                var _currWidth = 0;
                for (var i = 0; i < _quickReplesDivs.length; i++) {
                  _currWidth += _quickReplesDivs[i].offsetWidth + 10;
                  if (_currWidth > _totalWidth) {
                    //_scrollParentDiv[0].scrollLeft = (_totalWidth - _quickReplesDivs[i].offsetWidth+20);
                    $(_scrollParentDiv).animate(
                      {
                        scrollLeft:
                          _totalWidth - _quickReplesDivs[i].offsetWidth - 50,
                      },
                      "slow",
                      function () {
                        // deciding to enable left and right scroll icons
                        var rightIcon =
                          _scrollParentDiv[0].parentElement.querySelectorAll(
                            ".quickreplyRightIcon"
                          );
                        rightIcon[0].classList.remove("hide");
                        if (_scrollParentDiv[0].scrollLeft <= 0) {
                          var leftIcon =
                            _scrollParentDiv[0].parentElement.querySelectorAll(
                              ".quickreplyLeftIcon"
                            );
                          leftIcon[0].classList.add("hide");
                        }
                      }
                    );
                    break;
                  }
                }
              }
            });
          _chatContainer
            .off("click", ".quickreplyRightIcon")
            .on("click", ".quickreplyRightIcon", function (event) {
              var _quickReplesDivs =
                event.currentTarget.parentElement.getElementsByClassName(
                  "buttonTmplContentChild"
                );
              if (_quickReplesDivs.length) {
                var _scrollParentDiv =
                  event.target.parentElement.getElementsByClassName(
                    "quick_replies_btn_parent"
                  );
                var _totalWidth = event.target.parentElement.offsetWidth;
                var _currWidth = 0;
                // calculation for moving element scroll
                for (var i = 0; i < _quickReplesDivs.length; i++) {
                  _currWidth += _quickReplesDivs[i].offsetWidth + 10;
                  if (_currWidth > _totalWidth) {
                    //_scrollParentDiv[0].scrollLeft = _currWidth;
                    $(_scrollParentDiv).animate(
                      {
                        scrollLeft:
                          _scrollParentDiv[0].scrollLeft +
                          _quickReplesDivs[i].offsetWidth +
                          20,
                      },
                      "slow",
                      function () {
                        // deciding to enable left and right scroll icons
                        var leftIcon =
                          _scrollParentDiv[0].parentElement.querySelectorAll(
                            ".quickreplyLeftIcon"
                          );
                        leftIcon[0].classList.remove("hide");
                        if (
                          _scrollParentDiv[0].scrollLeft + _totalWidth + 10 >=
                          _scrollParentDiv[0].scrollWidth
                        ) {
                          var rightIcon =
                            _scrollParentDiv[0].parentElement.querySelectorAll(
                              ".quickreplyRightIcon"
                            );
                          rightIcon[0].classList.add("hide");
                        }
                      }
                    );
                    break;
                  }
                }
              }
            });
          _chatContainer
            .off("click", ".minimized")
            .on("click", ".minimized", function (event) { //removed minimized-title
              // fn call to Notify the parent when the chatbot is maximized
              console.log("~~~~max clicked..");
              maximizeChatbot(me.config.botOptions);
              if (me.config.multiPageApp && me.config.multiPageApp.enable) {
                me.setLocalStoreItem("kr-cw-state", "open");
              }
              _chatContainer.removeClass("minimize");
              me.minimized = false;
              if (me.skipedInit) {
                if (me.config.multiPageApp && me.config.multiPageApp.enable) {
                  me.setLocalStoreItem(
                    "kr-cw-uid",
                    me.config.botOptions.userIdentity
                  );
                }
                bot.init(me.config.botOptions, me.config.messageHistoryLimit);
                me.skipedInit = false;
              }
              /*_chatContainer.draggable({
                          handle: _chatContainer.find(".kore-chat-header .header-title"),
                          containment: "window",
                          scroll: false
                      });*/
              if (me.expanded === true) {
                $(".kore-chat-overlay").show();
              }
              var evt = document.createEvent("HTMLEvents");
              evt.initEvent("resize", true, false);
              $(".chat-container").animate(
                {
                  scrollTop: $(".chat-container").prop("scrollHeight"),
                },
                100
              );
            });
  
          _chatContainer
            .off("click", ".reload-btn")
            .on("click", ".reload-btn", function (event, data) {
              if (data && data.isReconnect) {
                me.config.botOptions.forceReconnecting = true;
              } else {
                me.config.botOptions.forceReconnecting = false; //make it to true if reconnect button should not trigger on connect message
              }
              $(this).addClass("disabled").prop("disabled", true);
              $(".close-btn").addClass("disabled").prop("disabled", true);
              setTimeout(function () {
                me.resetWindow();
              });
              $(".recordingMicrophone").trigger("click");
              if (ttsAudioSource) {
                ttsAudioSource.stop();
              }
            });
          _chatContainer
            .off("click", ".ttspeaker")
            .on("click", ".ttspeaker", function (event) {
              if (me.config.isTTSEnabled) {
                if (me.isTTSOn) {
                  if (ttsAudioSource) {
                    ttsAudioSource.stop();
                  }
                  cancelTTSConnection();
                  me.isTTSOn = false;
                  $("#ttspeaker")[0].pause();
                  if (
                    me.config.ttsInterface &&
                    me.config.ttsInterface === "webapi"
                  ) {
                    var synth = window.speechSynthesis;
                    synth.pause();
                  } else if (me.config.ttsInterface === "awspolly") {
                    if (me.isTTSOn === false) {
                      // isTTSOn = false;
                      gainNode.gain.value = 0; // 10 %
                      $(".ttspeakerDiv").addClass("ttsOff");
                    }
                  }
                  $(".ttspeakerDiv").addClass("ttsOff");
                } else {
                  if (
                    me.config.ttsInterface &&
                    me.config.ttsInterface === "webapi"
                  ) {
                    _ttsConnection = me.speakWithWebAPI();
                  } else if (
                    me.config.ttsInterface &&
                    me.config.ttsInterface === "awspolly"
                  ) {
                    gainNode.gain.value = 1;
                  } else {
                    _ttsConnection = createSocketForTTS();
                  }
                  me.isTTSOn = true;
                  $(".ttspeakerDiv").removeClass("ttsOff");
                }
              }
            });
  
          var element = document.querySelector(".droppable");
          function callback(files) {
            // Here, we simply log the Array of files to the console.
            if (fileUploaderCounter == 1) {
              alert("You can upload only one file");
              return;
            }
            cnvertFiles(this, files[0]);
            if (files.length > 1) {
              alert("You can upload only one file");
            }
          }
          // me.makeDroppable(element, callback);
          me.bindSDKEvents();
        };
  
        chatWindow.prototype.getBotMetaData = function () {
          var me = this;
          me.bot.getBotMetaData(
            function (res) {
              me.sendWebhookOnConnectEvent();
            },
            function (errRes) {
              me.sendWebhookOnConnectEvent();
            }
          );
        };
        chatWindow.prototype.sendWebhookOnConnectEvent = function () {
          var me = this;
          me.sendMessageViaWebHook(
            {
              type: "event",
              val: "ON_CONNECT",
            },
            function (msgsData) {
              me.onBotReady();
              me.handleWebHookResponse(msgsData);
            },
            function () {
              me.onBotReady();
              console.log("Kore:error sending on connect event");
            },
            {
              session: {
                new: true,
              },
            }
          );
        };
  
        chatWindow.prototype.bindSDKEvents = function () {
          //hook to add custom events
          var me = this;
          me.bot.on("open", function (response) {
            me.onBotReady();
          });
  
          me.bot.on("message", function (message) {
            //actual implementation starts here
            if (me.popupOpened === true) {
              $(".kore-auth-popup .close-popup").trigger("click");
            }
            var tempData = JSON.parse(message.data);
  
            if (tempData.from === "bot" && tempData.type === "bot_response") {
              if (tempData && tempData.message && tempData.message.length) {
                if (tempData.message[0]) {
                  if (!tempData.message[0].cInfo) {
                    tempData.message[0].cInfo = {};
                  }
                  if (
                    tempData.message[0].component &&
                    !tempData.message[0].component.payload.text
                  ) {
                    try {
                      tempData.message[0].component = JSON.parse(
                        tempData.message[0].component.payload
                      );
                    } catch (err) {
                      tempData.message[0].component =
                        tempData.message[0].component.payload;
                    }
                  }
                  if (
                    tempData.message[0].component &&
                    tempData.message[0].component.payload &&
                    tempData.message[0].component.payload.text
                  ) {
                    tempData.message[0].cInfo.body =
                      tempData.message[0].component.payload.text;
                  }
                  if (
                    tempData.message[0].component &&
                    tempData.message[0].component.payload &&
                    (tempData.message[0].component.payload.videoUrl ||
                      tempData.message[0].component.payload.audioUrl)
                  ) {
                    tempData.message[0].cInfo.body =
                      tempData.message[0].component.payload.text || "";
                  }
                }
                if (me.loadHistory && me.historyLoading) {
                  messagesQueue.push(tempData);
                } else {
                  if (me.config.supportDelayedMessages) {
                    me.pushTorenderMessagesQueue(tempData);
                  } else {
                    me.renderMessage(tempData);
                  }
                }
              }
            } else if (
              tempData.from === "self" &&
              tempData.type === "user_message"
            ) {
              var tempmsg = tempData.message;
              var msgData = {};
              if (
                tempmsg &&
                tempmsg.attachments &&
                tempmsg.attachments[0] &&
                tempmsg.attachments[0].fileId
              ) {
                msgData = {
                  type: "currentUser",
                  message: [
                    {
                      type: "text",
                      cInfo: {
                        body: tempmsg.body,
                        attachments: tempmsg.attachments,
                      },
                      clientMessageId: tempData.id,
                    },
                  ],
                  createdOn: tempData.id,
                };
              } else {
                msgData = {
                  type: "currentUser",
                  message: [
                    {
                      type: "text",
                      cInfo: { body: tempmsg.body },
                      clientMessageId: tempData.id,
                    },
                  ],
                  createdOn: tempData.id,
                };
              }
              me.renderMessage(msgData);
            }
            if (tempData.type === "appInvalidNotification") {
              setTimeout(function () {
                $(".trainWarningDiv").addClass("showMsg");
              }, 2000);
            }
          });
  
          me.bot.on("webhook_ready", function (response) {
            if (!me.config.loadHistory) {
              me.getBotMetaData();
            }
          });
  
          me.bot.on("webhook_reconnected", function (response) {
            me.onBotReady();
          });
        };
        chatWindow.prototype.bindCustomEvents = function () {
          //hook to add custom events
          var me = this;
          var _chatContainer = me.config.chatContainer;
          //add additional events or override events in this method
          //e.stopImmediatePropagation(); would be useful to override
        };
        chatWindow.prototype.onBotReady = function () {
          //hook to add custom events
          var me = this;
  
          var _chatContainer = me.config.chatContainer;
          //actual implementation starts here
          me.accessToken = me.config.botOptions.accessToken;
          var _chatInput = _chatContainer.find(".kore-chat-footer .chatInputBox");
          _chatContainer
            .find(".kore-chat-header .header-title")
            .html(me.config.chatTitle)
            .attr("title", me.config.chatTitle);
          _chatContainer
            .find(".kore-chat-header .disabled")
            .prop("disabled", false)
            .removeClass("disabled");
          if (!me.loadHistory) {
            setTimeout(function () {
              $(".chatInputBox").focus();
              $(".disableFooter").removeClass("disableFooter");
            });
          }
          if (sendFailedMessage.messageId) {
            var msgEle = _chatContainer.find("#" + sendFailedMessage.messageId);
            msgEle.find(".errorMsg").remove();
            var msgTxt = msgEle.find(".messageBubble").text().trim();
            _chatContainer.find(".chatInputBox").text(msgTxt);
            msgEle.remove();
            me.sendMessage($(".chatInputBox"));
          }
        };
        chatWindow.prototype.bindIframeEvents = function (authPopup) {
          var me = this;
          authPopup.on("click", ".close-popup", function () {
            $(this).closest(".kore-auth-popup").remove();
            $(".kore-auth-layover").remove();
            me.popupOpened = false;
          });
  
          var ifram = authPopup.find("iframe")[0];
  
          ifram.addEventListener(
            "onload",
            function () {
              console.log(this);
            },
            true
          );
        };
  
        chatWindow.prototype.render = function (chatWindowHtml) {
          var me = this;
          $(me.config.container).append(chatWindowHtml);
  
          if (me.config.container !== "body") {
            $(me.config.container).addClass("pos-relative");
            $(me.config.chatContainer).addClass("pos-absolute");
          }
          me.setCollapsedModeStyles();
          me.chatPSObj = new KRPerfectScrollbar(
            me.config.chatContainer.find(".chat-container").get(0),
            {
              suppressScrollX: true,
            }
          );
          me.bindEvents();
        };
  
        chatWindow.prototype.sendMessage = function (
          chatInput,
          renderMsg,
          msgObject,
          isMessageTobeHidden
        ) {
          var me = this;
          me.stopSpeaking();
          if (
            chatInput.text().trim() === "" &&
            $(".attachment").html().trim().length == 0
          ) {
            return;
          }
          if (
            msgObject &&
            msgObject.message &&
            msgObject.message.length &&
            msgObject.message[0] &&
            msgObject.message[0].component &&
            msgObject.message[0].component.payload &&
            msgObject.message[0].component.payload.ignoreCheckMark
          ) {
            var ignoreCheckMark =
              msgObject.message[0].component.payload.ignoreCheckMark;
          }
          if (me.config.allowLocation) {
            me.bot.fetchUserLocation();
          }
          var _bodyContainer = $(me.config.chatContainer).find(".kore-chat-body");
          var _footerContainer = $(me.config.chatContainer).find(
            ".kore-chat-footer"
          );
          var clientMessageId = new Date().getTime();
          if (sendFailedMessage.messageId) {
            clientMessageId = sendFailedMessage.messageId;
            sendFailedMessage.messageId = null;
          }
          var msgData = {};
          fileUploaderCounter = 0;
          //to send \n to server for new lines
          chatInput.html(
            chatInitialize.koreReplaceAll(chatInput.text(), "<br>", "\n")
          );
          if (me.attachmentInfo && Object.keys(me.attachmentInfo).length) {
            msgData = {
              type: "currentUser",
              message: [
                {
                  type: "text",
                  cInfo: {
                    body: chatInput.text(),
                    attachments: [me.attachmentInfo],
                  },
                  clientMessageId: clientMessageId,
                },
              ],
              createdOn: clientMessageId,
            };
            $(".attachment").html("");
            $(".kore-chat-window").removeClass("kore-chat-attachment");
            document.getElementById("captureAttachmnts").value = "";
          } else {
            me.attachmentInfo = {};
            msgData = {
              type: "currentUser",
              message: [
                {
                  type: "text",
                  cInfo: { body: chatInput.text() },
                  clientMessageId: clientMessageId,
                },
              ],
              createdOn: clientMessageId,
            };
          }
  
          var messageToBot = {};
          messageToBot["clientMessageId"] = clientMessageId;
          if (
            Object.keys(me.attachmentInfo).length > 0 &&
            chatInput.text().trim().length
          ) {
            me.attachmentInfo.fileId = attachmentInfo.fileId;
            messageToBot["message"] = {
              body: chatInput.text().trim(),
              attachments: [me.attachmentInfo],
            };
          } else if (Object.keys(me.attachmentInfo).length > 0) {
            me.attachmentInfo.fileId = attachmentInfo.fileId;
            messageToBot["message"] = { attachments: [me.attachmentInfo] };
          } else {
            messageToBot["message"] = { body: chatInput.text().trim() };
          }
          messageToBot["resourceid"] = "/bot.message";
  
          if (renderMsg && typeof renderMsg === "string") {
            messageToBot["message"].renderMsg = renderMsg;
          }
          if (msgObject && msgObject.customdata) {
            messageToBot["message"].customdata = msgObject.customdata;
          }
          if (msgObject && msgObject.metaTags) {
            messageToBot["message"].metaTags = msgObject.metaTags;
          }
  
          if (msgObject && (msgObject.nlmeta || msgObject.nlMeta)) {
            messageToBot["message"].nlMeta = msgObject.nlmeta || msgObject.nlMeta;
          }
          if (
            me.config &&
            me.config &&
            me.config.botOptions &&
            me.config.botOptions.webhookConfig &&
            me.config.botOptions.webhookConfig.enable
          ) {
            me.sendMessageViaWebHook(
              chatInput.text(),
              function (msgsData) {
                me.handleWebHookResponse(msgsData);
              },
              function (err) {
                setTimeout(function () {
                  var failedMsgEle = $(
                    '.kore-chat-window [id="' + clientMessageId + '"]'
                  );
                  failedMsgEle
                    .find(".messageBubble")
                    .append(
                      '<div class="errorMsg hide"><span class="failed-text">Send Failed </span><div class="retry"><span class="retry-icon"></span><span class="retry-text">Retry</span></div></div>'
                    );
                  if (
                    sendFailedMessage.retryCount < sendFailedMessage.MAX_RETRIES
                  ) {
                    failedMsgEle.find(".retry").trigger("click");
                    sendFailedMessage.retryCount++;
                  } else {
                    failedMsgEle.find(".errorMsg").removeClass("hide");
                    $(".typingIndicatorContent").css("display", "none");
                  }
                }, 350);
              },
              me.attachmentInfo ? { attachments: [me.attachmentInfo] } : null
            );
          } else {
            me.bot.sendMessage(messageToBot, function messageSent(err) {
              if (err && err.message) {
                setTimeout(function () {
                  var failedMsgEle = $(
                    '.kore-chat-window [id="' + clientMessageId + '"]'
                  );
                  failedMsgEle
                    .find(".messageBubble")
                    .append(
                      '<div class="errorMsg hide"><span class="failed-text">Send Failed </span><div class="retry"><span class="retry-icon"></span><span class="retry-text">Retry</span></div></div>'
                    );
                  if (
                    sendFailedMessage.retryCount < sendFailedMessage.MAX_RETRIES
                  ) {
                    failedMsgEle.find(".retry").trigger("click");
                    sendFailedMessage.retryCount++;
                  } else {
                    failedMsgEle.find(".errorMsg").removeClass("hide");
                    $(".typingIndicatorContent").css("display", "none");
                  }
                }, 350);
              }
            });
          }
          me.attachmentInfo = {};
          chatInput.html("");
          $(".sendButton").addClass("disabled");
          _bodyContainer.css("bottom", _footerContainer.outerHeight());
          me.resetPingMessage();
          $(".typingIndicatorContent").css("display", "block");
          if (me.typingIndicatorTimer) {
            clearTimeout(me.typingIndicatorTimer);
          }
          me.typingIndicatorTimer = setTimeout(function () {
            $(".typingIndicatorContent").css("display", "none");
          }, me.config.maxTypingIndicatorTime || 10000);
          if (renderMsg && typeof renderMsg === "string") {
            msgData.message[0].cInfo.body = renderMsg;
          }
          msgData.message[0].cInfo.ignoreCheckMark = ignoreCheckMark;
          if (!isMessageTobeHidden) {
            me.renderMessage(msgData);
          }
        };
  
        chatWindow.prototype.handleWebHookResponse = function (msgsData) {
          var SUBSEQUENT_RENDER_DELAY = 500;
          if (msgsData && msgsData.length) {
            msgsData.forEach(function (msgData, index) {
              setTimeout(
                function () {
                  chatInitialize.renderMessage(msgData);
                },
                index >= 1 ? SUBSEQUENT_RENDER_DELAY : 0
              );
            });
          }
        };
  
        chatWindow.prototype.sendMessageViaWebHook = function (
          message,
          successCb,
          failureCB,
          options
        ) {
          var me = this;
          if (me.config.botOptions.webhookConfig.webhookURL) {
            var payload = {
              session: {
                new: false,
              },
              //"preferredChannelForResponse": "rtm",
              message: {
                text: message,
              },
              from: {
                id: me.config.botOptions.userIdentity,
                userInfo: {
                  firstName: "",
                  lastName: "",
                  email: "",
                },
              },
              to: {
                id: "Kore.ai",
                groupInfo: {
                  id: "",
                  name: "",
                },
              },
            };
  
            if (me.config.botOptions.webhookConfig.useSDKChannelResponses) {
              payload.preferredChannelForResponse = "rtm";
            }
  
            if (
              me.config.botOptions.webhookConfig.apiVersion &&
              me.config.botOptions.webhookConfig.apiVersion === 2
            ) {
              payload.message = {
                type: "text",
                val: message,
              };
            }
            if (typeof message === "object") {
              payload.message = message;
            }
            if (options && options.session) {
              payload.session = options.session;
            }
            if (options && options.attachments) {
              payload.message.attachments = options.attachments;
            }
  
            me.bot.sendMessageViaWebhook(payload, successCb, failureCB);
          } else {
            console.error("KORE:Please provide webhookURL in webhookConfig");
          }
        };
  
        chatWindow.prototype.closeConversationSession = function () {
          var me = this;
          var clientMessageId = new Date().getTime();
          var messageToBot = {};
          messageToBot["clientMessageId"] = clientMessageId;
          messageToBot["resourceid"] = "/bot.closeConversationSession";
          bot.sendMessage(messageToBot, function messageSent(err) {
            console.error("bot.closeConversationSession send failed sending");
          });
        };
  
        chatWindow.prototype.renderMessage = function (msgData) {
          console.log(msgData);
          var me = this,
            messageHtml = "",
            extension = "",
            _extractedFileName = "";
          var helpers = me.helpers;
          msgData.createdOnTimemillis = new Date(msgData.createdOn).valueOf();
          me.customTemplateObj.helpers = me.helpers;
          me.customTemplateObj.extension = extension;
          graphLibGlob = me.config.graphLib || "d3";
          if (msgData.type === "bot_response") {
            sendFailedMessage.retryCount = 0;
            waiting_for_message = false;
            setTimeout(function () {
              $(".typingIndicator").css(
                "background-image",
                "url(" + msgData.icon + ")"
              );
            }, 500);
            setTimeout(function () {
              if (!waiting_for_message) {
                if (me.typingIndicatorTimer) {
                  clearTimeout(me.typingIndicatorTimer);
                }
                $(".typingIndicatorContent").css("display", "none");
              }
            }, 500);
          } else {
            waiting_for_message = false;
          }
          var _chatContainer = $(me.config.chatContainer).find(".chat-container");
          if (
            msgData.message &&
            msgData.message[0] &&
            msgData.message[0].cInfo &&
            msgData.message[0].cInfo.attachments
          ) {
            extension = strSplit(
              msgData.message[0].cInfo.attachments[0].fileName
            );
          }
          if (
            msgData.message &&
            msgData.message[0] &&
            msgData.message[0].component &&
            msgData.message[0].component.payload &&
            msgData.message[0].component.payload.url
          ) {
            extension = strSplit(msgData.message[0].component.payload.url);
            _extractedFileName = msgData.message[0].component.payload.name
              ? msgData.message[0].component.payload.name
              : msgData.message[0].component.payload.url.replace(/^.*[\\\/]/, "");
            // _extractedFileName = msgData.message[0].component.payload.url.replace(/^.*[\\\/]/, '');
            if (msgData.message[0].component.payload.fileName) {
              _extractedFileName = msgData.message[0].component.payload.fileName;
              extension = strSplit(_extractedFileName);
            }
          }
          if (
            msgData.message &&
            msgData.message[0] &&
            msgData.message[0].component &&
            msgData.message[0].component.payload &&
            msgData.message[0].component.payload.fileUrl
          ) {
            extension = strSplit(msgData.message[0].component.payload.fileUrl);
            _extractedFileName =
              msgData.message[0].component.payload.fileUrl.replace(
                /^.*[\\\/]/,
                ""
              );
          }
  
          /* checking for matched custom template */
          messageHtml = me.customTemplateObj.renderMessage(msgData);
          if (
            messageHtml === "" &&
            msgData &&
            msgData.message &&
            msgData.message[0]
          ) {
            if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type == "button"
            ) {
              messageHtml = $(me.getChatTemplate("templatebutton")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type ==
                "button_forRedirect"
            ) {
              messageHtml = $(
                me.getChatTemplate("templatebutton_forRedirect")
              ).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type ==
                "wait_for_response"
            ) {
              // to show typing indicator until next response receive
              waiting_for_message = true;
              $(".typingIndicatorContent").css("display", "block");
              return;
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type == "list"
            ) {
              messageHtml = $(me.getChatTemplate("templatelist")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type ==
                "templaterecentpolicylist"
            ) {
              console.log("IN----------------templaterecentpolicylist");
              messageHtml = $(
                me.getChatTemplate("templaterecentpolicylist")
              ).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type ==
                "templaterecentpolicylistsinglerecord"
            ) {
              messageHtml = $(
                me.getChatTemplate("templaterecentpolicylistsinglerecord")
              ).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type == "tmplist"
            ) {
              messageHtml = $(me.getChatTemplate("tmptemplatelist")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type ==
                "quick_replies"
            ) {
              messageHtml = $(me.getChatTemplate("templatequickreply")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
              setTimeout(function () {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("resize", true, false);
                window.dispatchEvent(evt);
              }, 150);
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type ==
                "quick_replies_girdview"
            ) {
              messageHtml = $(
                me.getChatTemplate("templatequickreply_gridview")
              ).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
              setTimeout(function () {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("resize", true, false);
                window.dispatchEvent(evt);
              }, 150);
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type == "carousel"
            ) {
              messageHtml = $(me.getChatTemplate("carouselTemplate")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
  
              setTimeout(function () {
                $(".carousel:last").addClass("carousel" + carouselTemplateCount);
                var count = $(".carousel" + carouselTemplateCount).children()
                  .length;
                if (count >= 1) {
                  var carouselOneByOne = new PureJSCarousel({
                    carousel: ".carousel" + carouselTemplateCount,
                    slide: ".slide",
                    oneByOne: true,
                  });
                  $(".carousel" + carouselTemplateCount)
                    .parent()
                    .show();
                  $(".carousel" + carouselTemplateCount).attr(
                    "style",
                    "height: 100% !important"
                  );
                  carouselEles.push(carouselOneByOne);
                }
                //window.dispatchEvent(new Event('resize'));
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("resize", true, false);
                window.dispatchEvent(evt);
                carouselTemplateCount += 1;
                _chatContainer.animate(
                  {
                    scrollTop: _chatContainer.prop("scrollHeight"),
                  },
                  0
                );
              });
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              (msgData.message[0].component.type == "image" ||
                msgData.message[0].component.type == "audio" ||
                msgData.message[0].component.type == "video" ||
                msgData.message[0].component.type == "link")
            ) {
              messageHtml = $(me.getChatTemplate("templateAttachment")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
                extractedFileName: _extractedFileName,
              });
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type == "table"
            ) {
              messageHtml = $(me.getChatTemplate("tableChartTemplate")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
              setTimeout(function () {
                var acc = document.getElementsByClassName("accordionRow");
                for (var i = 0; i < acc.length; i++) {
                  acc[i].onclick = function () {
                    this.classList.toggle("open");
                  };
                }
                var showFullTableModal =
                  document.getElementsByClassName("showMore");
                for (var i = 0; i < showFullTableModal.length; i++) {
                  showFullTableModal[i].onclick = function () {
                    var parentli = this.parentNode.parentElement;
                    $("#dialog").empty();
                    $("#dialog").html($(parentli).find(".tablechartDiv").html());
                    $(".hello").clone().appendTo(".goodbye");
                    var modal = document.getElementById("myPreviewModal");
                    $(".largePreviewContent").empty();
                    //$(".largePreviewContent").html($(parentli).find('.tablechartDiv').html());
                    $(parentli)
                      .find(".tablechartDiv")
                      .clone()
                      .appendTo(".largePreviewContent");
                    modal.style.display = "block";
                    // Get the <span> element that closes the modal
                    var span =
                      document.getElementsByClassName("closeElePreview")[0];
                    // When the user clicks on <span> (x), close the modal
                    span.onclick = function () {
                      modal.style.display = "none";
                      $(".largePreviewContent").removeClass("addheight");
                    };
                  };
                }
              }, 350);
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type ==
                "tableAccordian"
            ) {
              console.log(msgData);
              messageHtml = $(me.getChatTemplate("tableAccordianTemplate")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
              setTimeout(function () {
                var acc = document.getElementsByClassName("accordionRow");
                for (var i = 0; i < acc.length; i++) {
                  acc[i].onclick = function () {
                    this.classList.toggle("open");
                  };
                }
                var showFullTableModal =
                  document.getElementsByClassName("showMore");
                for (var i = 0; i < showFullTableModal.length; i++) {
                  showFullTableModal[i].onclick = function () {
                    var parentli = this.parentNode.parentElement;
                    var myModal = document.getElementById("myModal");
                    myModal.style.display = "block";
                    $("#dialog").empty();
                    $("#dialog").html($(parentli).find(".popup").html());
                    $(".hello").clone().appendTo(".goodbye");
                    var modal = document.getElementById("myPreviewModal");
  
                    $(".largePreviewContent").empty();
  
                    //$(".largePreviewContent").html($(parentli).find('.tablechartDiv').html());
                    $(parentli)
                      .find(".popup")
                      .clone()
                      .appendTo(".largePreviewContent");
                    modal.style.display = "block";
                    // Get the <span> element that closes the modal
                    var span =
                      document.getElementsByClassName("closeElePreview")[0];
                    // When the user clicks on <span> (x), close the modal
                    span.onclick = function () {
                      modal.style.display = "none";
                      myModal.style.display = "none";
                      $(".largePreviewContent").removeClass("addheight");
                    };
                  };
                }
              }, 350);
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type == "mini_table"
            ) {
              console.log("Hitt in --- mini_table");
              if (msgData.message[0].component.payload.layout == "horizontal") {
                messageHtml = $(
                  me.getChatTemplate("miniTableHorizontalTemplate")
                ).tmpl({
                  msgData: msgData,
                  helpers: helpers,
                  extension: extension,
                });
  
                setTimeout(function () {
                  $(".carousel:last").addClass(
                    "carousel" + carouselTemplateCount
                  );
                  var count = $(".carousel" + carouselTemplateCount).children()
                    .length;
                  if (count > 1) {
                    var carouselOneByOne = new PureJSCarousel({
                      carousel: ".carousel" + carouselTemplateCount,
                      slide: ".slide",
                      oneByOne: true,
                    });
                    $(".carousel" + carouselTemplateCount)
                      .parent()
                      .show();
                    $(".carousel" + carouselTemplateCount).attr(
                      "style",
                      "height: 100% !important"
                    );
                    carouselEles.push(carouselOneByOne);
                  }
                  //window.dispatchEvent(new Event('resize'));
                  var evt = document.createEvent("HTMLEvents");
                  evt.initEvent("resize", true, false);
                  window.dispatchEvent(evt);
                  carouselTemplateCount += 1;
                  _chatContainer.animate(
                    {
                      scrollTop: _chatContainer.prop("scrollHeight"),
                    },
                    0
                  );
                });
              } else {
                messageHtml = $(
                  me.getChatTemplate("miniTableChartTemplate")
                ).tmpl({
                  msgData: msgData,
                  helpers: helpers,
                  extension: extension,
                });
              }
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type == "multi_select"
            ) {
              messageHtml = $(this.getChatTemplate("checkBoxesTemplate")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type == "like_dislike"
            ) {
              messageHtml = $(this.getChatTemplate("likeDislikeTemplate")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type == "piechart"
            ) {
              messageHtml = $(me.getChatTemplate("pieChartTemplate")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
              //storing the type of the graph to be displayed.
              if (me.config.graphLib === "google") {
                setTimeout(function () {
                  google.charts.load("current", { packages: ["corechart"] });
                  google.charts.setOnLoadCallback(drawChart);
                  function drawChart() {
                    var data = new google.visualization.DataTable();
                    data.addColumn("string", "Task");
                    data.addColumn("number", "Hours per Day");
                    if (
                      msgData.message[0].component.payload.elements &&
                      msgData.message[0].component.payload.elements[0]
                        .displayValue
                    ) {
                      data.addColumn({ type: "string", role: "tooltip" });
                    }
                    var pieChartData = [];
                    var piechartElements =
                      msgData.message[0].component.payload.elements;
                    for (var i = 0; i < piechartElements.length; i++) {
                      var arr = [
                        piechartElements[i].title +
                          " \n" +
                          piechartElements[i].value,
                      ];
                      arr.push(parseFloat(piechartElements[i].value));
                      if (piechartElements[i].displayValue) {
                        arr.push(piechartElements[i].displayValue);
                      }
                      pieChartData.push(arr);
                    }
                    data.addRows(pieChartData);
                    var options = {
                      chartArea: {
                        left: "3%",
                        top: "3%",
                        height: "94%",
                        width: "94%",
                      },
                      pieSliceTextStyle: {},
                      colors: window.chartColors,
                      legend: {
                        textStyle: {
                          color: "#b3bac8",
                        },
                      },
                    };
  
                    if (piechartElements.length === 1) {
                      // if only element, then deault donut chart
                      options.pieHole = 0.5;
                      options.pieSliceTextStyle.color = "black";
                    }
                    if (msgData.message[0].component.payload.pie_type) {
                      //chart based on user requireent
                      if (
                        msgData.message[0].component.payload.pie_type === "donut"
                      ) {
                        options.pieHole = 0.6;
                        options.pieSliceTextStyle.color = "black";
                        options.legend.position = "none";
                      } else if (
                        msgData.message[0].component.payload.pie_type ===
                        "donut_legend"
                      ) {
                        options.pieHole = 0.6;
                        options.pieSliceTextStyle.color = "black";
                      }
                    }
                    var _piechartObj = {
                      id: "piechart" + msgData.messageId,
                      data: data,
                      options: options,
                      type: "piechart",
                    };
                    available_charts.push(_piechartObj);
                    var container = document.getElementById(
                      "piechart" + msgData.messageId
                    );
                    var chart = new google.visualization.PieChart(container);
                    chart.draw(data, options);
                    //window.PieChartCount = window.PieChartCount + 1;
                  }
                }, 150);
              } else if (graphLibGlob === "d3") {
                if (msgData.message[0].component.payload.pie_type === undefined) {
                  msgData.message[0].component.payload.pie_type = "regular";
                }
                if (msgData.message[0].component.payload.pie_type) {
                  // define data
                  dimens = {};
                  dimens.width = 300;
                  dimens.height = 200;
                  dimens.legendRectSize = 10;
                  dimens.legendSpacing = 2.4;
                  if (
                    msgData.message[0].component.payload.pie_type === "regular"
                  ) {
                    setTimeout(function () {
                      var _piechartObj = {
                        id: "piechart" + msgData.messageId,
                        data: msgData,
                        type: "regular",
                      };
                      available_charts.push(_piechartObj);
                      KoreGraphAdapter.drawD3Pie(
                        msgData,
                        dimens,
                        "#piechart" + msgData.messageId,
                        12
                      );
                      //window.PieChartCount = window.PieChartCount + 1;
                    }, 150);
                  } else if (
                    msgData.message[0].component.payload.pie_type === "donut"
                  ) {
                    setTimeout(function () {
                      var _piechartObj = {
                        id: "piechart" + msgData.messageId,
                        data: msgData,
                        type: "donut",
                      };
                      available_charts.push(_piechartObj);
                      KoreGraphAdapter.drawD3PieDonut(
                        msgData,
                        dimens,
                        "#piechart" + msgData.messageId,
                        12,
                        "donut"
                      );
                      //window.PieChartCount = window.PieChartCount + 1;
                    }, 150);
                  } else if (
                    msgData.message[0].component.payload.pie_type ===
                    "donut_legend"
                  ) {
                    setTimeout(function () {
                      var _piechartObj = {
                        id: "piechart" + msgData.messageId,
                        data: msgData,
                        type: "donut_legend",
                      };
                      available_charts.push(_piechartObj);
                      KoreGraphAdapter.drawD3PieDonut(
                        msgData,
                        dimens,
                        "#piechart" + msgData.messageId,
                        12,
                        "donut_legend"
                      );
                      //window.PieChartCount = window.PieChartCount + 1;
                    }, 150);
                  }
                }
              }
              setTimeout(function () {
                $(".chat-container").scrollTop(
                  $(".chat-container").prop("scrollHeight")
                );
                handleChartOnClick();
              }, 200);
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type == "barchart"
            ) {
              messageHtml = $(me.getChatTemplate("barchartTemplate")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
              if (graphLibGlob === "google") {
                setTimeout(function () {
                  google.charts.load("current", {
                    packages: ["corechart", "bar"],
                  });
                  google.charts.setOnLoadCallback(drawChart);
                  function drawChart() {
                    var customToolTips = false;
                    var data = new google.visualization.DataTable();
                    data.addColumn("string", "y");
                    //adding legend labels
                    for (
                      var i = 0;
                      i < msgData.message[0].component.payload.elements.length;
                      i++
                    ) {
                      var currEle =
                        msgData.message[0].component.payload.elements[i];
                      data.addColumn("number", currEle.title);
                      //checking for display values ( custom tooltips)
                      if (currEle.displayValues && currEle.displayValues.length) {
                        data.addColumn({ type: "string", role: "tooltip" });
                        customToolTips = true;
                      }
                    }
  
                    //filling rows
                    var totalLines =
                      msgData.message[0].component.payload.elements.length;
                    for (
                      var i = 0;
                      i < msgData.message[0].component.payload.X_axis.length;
                      i++
                    ) {
                      var arr = [];
                      arr.push(msgData.message[0].component.payload.X_axis[i]);
                      for (var j = 0; j < totalLines; j++) {
                        arr.push(
                          parseFloat(
                            msgData.message[0].component.payload.elements[j]
                              .values[i]
                          )
                        );
                        if (customToolTips) {
                          arr.push(
                            msgData.message[0].component.payload.elements[j]
                              .displayValues[i]
                          );
                        }
                      }
                      data.addRow(arr);
                    }
                    var options = {
                      chartArea: {
                        height: "70%",
                        width: "80%",
                      },
                      legend: {
                        position: "top",
                        alignment: "end",
                        maxLines: 3,
                        textStyle: {
                          color: "#b3bac8",
                        },
                      },
                      hAxis: {
                        gridlines: {
                          color: "transparent",
                        },
                        textStyle: {
                          color: "#b3bac8",
                        },
                      },
                      vAxis: {
                        gridlines: {
                          color: "transparent",
                        },
                        textStyle: {
                          color: "#b3bac8",
                        },
                        baselineColor: "transparent",
                      },
                      animation: {
                        duration: 500,
                        easing: "out",
                        startup: true,
                      },
                      bar: { groupWidth: "25%" },
                      colors: window.chartColors,
                    };
  
                    //horizontal chart, then increase size of bard
                    if (
                      msgData.message[0].component.payload.direction !==
                      "vertical"
                    ) {
                      options.bar.groupWidth = "45%";
                      options.hAxis.baselineColor = "#b3bac8";
                    }
                    //stacked chart
                    if (msgData.message[0].component.payload.stacked) {
                      options.isStacked = true;
                      options.bar.groupWidth = "25%";
                    }
                    var _barchartObj = {
                      id: "barchart" + msgData.messageId,
                      direction: msgData.message[0].component.payload.direction,
                      data: data,
                      options: options,
                      type: "barchart",
                    };
                    available_charts.push(_barchartObj);
                    var container = document.getElementById(
                      "barchart" + msgData.messageId
                    );
                    var chart = null;
                    if (
                      msgData.message[0].component.payload.direction ===
                      "vertical"
                    ) {
                      chart = new google.visualization.ColumnChart(container);
                    } else {
                      chart = new google.visualization.BarChart(container);
                    }
                    chart.draw(data, options);
                    //window.barchartCount = window.barchartCount + 1;
                  }
                }, 150);
              } else if (graphLibGlob === "d3") {
                var dimens = {};
                dimens.outerWidth = 350;
                dimens.outerHeight = 300;
                dimens.innerHeight = 200;
                dimens.legendRectSize = 15;
                dimens.legendSpacing = 4;
                if (
                  msgData.message[0].component.payload.direction === undefined
                ) {
                  msgData.message[0].component.payload.direction = "horizontal";
                }
                if (
                  msgData.message[0].component.payload.direction ===
                    "horizontal" &&
                  !msgData.message[0].component.payload.stacked
                ) {
                  setTimeout(function () {
                    dimens.innerWidth = 180;
                    var _barchartObj = {
                      id: "Legend_barchart" + msgData.messageId,
                      data: msgData,
                      type: "barchart",
                    };
                    available_charts.push(_barchartObj);
                    KoreGraphAdapter.drawD3barHorizontalbarChart(
                      msgData,
                      dimens,
                      "#barchart" + msgData.messageId,
                      12
                    );
                    // window.barchartCount = window.barchartCount + 1;
                  }, 250);
                } else if (
                  msgData.message[0].component.payload.direction === "vertical" &&
                  msgData.message[0].component.payload.stacked
                ) {
                  setTimeout(function () {
                    dimens.outerWidth = 350;
                    dimens.innerWidth = 270;
                    var _barchartObj = {
                      id: "barchart" + msgData.messageId,
                      data: msgData,
                      type: "stackedBarchart",
                    };
                    available_charts.push(_barchartObj);
                    KoreGraphAdapter.drawD3barVerticalStackedChart(
                      msgData,
                      dimens,
                      "#barchart" + msgData.messageId,
                      12
                    );
                    // window.barchartCount = window.barchartCount + 1;
                  }, 250);
                } else if (
                  msgData.message[0].component.payload.direction ===
                    "horizontal" &&
                  msgData.message[0].component.payload.stacked
                ) {
                  setTimeout(function () {
                    dimens.innerWidth = 180;
                    var _barchartObj = {
                      id: "barchart" + msgData.messageId,
                      data: msgData,
                      type: "stackedBarchart",
                    };
                    available_charts.push(_barchartObj);
                    KoreGraphAdapter.drawD3barStackedChart(
                      msgData,
                      dimens,
                      "#barchart" + msgData.messageId,
                      12
                    );
                    // window.barchartCount = window.barchartCount + 1;
                  }, 250);
                } else if (
                  msgData.message[0].component.payload.direction === "vertical" &&
                  !msgData.message[0].component.payload.stacked
                ) {
                  setTimeout(function () {
                    dimens.innerWidth = 240;
                    var _barchartObj = {
                      id: "barchart" + msgData.messageId,
                      data: msgData,
                      type: "barchart",
                    };
                    available_charts.push(_barchartObj);
                    KoreGraphAdapter.drawD3barChart(
                      msgData,
                      dimens,
                      "#barchart" + msgData.messageId,
                      12
                    );
                    // window.barchartCount = window.barchartCount + 1;
                  }, 250);
                }
              }
              setTimeout(function () {
                $(".chat-container").scrollTop(
                  $(".chat-container").prop("scrollHeight")
                );
                handleChartOnClick();
              }, 300);
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type == "linechart"
            ) {
              messageHtml = $(me.getChatTemplate("linechartTemplate")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
              if (graphLibGlob === "google") {
                setTimeout(function () {
                  google.charts.load("current", {
                    packages: ["corechart", "line"],
                  });
                  google.charts.setOnLoadCallback(drawChart);
                  function drawChart() {
                    var customToolTips = false;
                    var data = new google.visualization.DataTable();
                    data.addColumn("string", "y");
                    //adding legend labels
                    for (
                      var i = 0;
                      i < msgData.message[0].component.payload.elements.length;
                      i++
                    ) {
                      var currEle =
                        msgData.message[0].component.payload.elements[i];
                      data.addColumn("number", currEle.title);
                      //checking for display values ( custom tooltips)
                      if (currEle.displayValues && currEle.displayValues.length) {
                        data.addColumn({ type: "string", role: "tooltip" });
                        customToolTips = true;
                      }
                    }
  
                    //filling rows
                    var totalLines =
                      msgData.message[0].component.payload.elements.length;
                    for (
                      var i = 0;
                      i < msgData.message[0].component.payload.X_axis.length;
                      i++
                    ) {
                      var arr = [];
                      arr.push(msgData.message[0].component.payload.X_axis[i]);
                      for (var j = 0; j < totalLines; j++) {
                        arr.push(
                          parseFloat(
                            msgData.message[0].component.payload.elements[j]
                              .values[i]
                          )
                        );
                        if (customToolTips) {
                          arr.push(
                            msgData.message[0].component.payload.elements[j]
                              .displayValues[i]
                          );
                        }
                      }
                      data.addRow(arr);
                    }
  
                    var options = {
                      curveType: "function",
                      chartArea: {
                        height: "70%",
                        width: "80%",
                      },
                      legend: {
                        position: "top",
                        alignment: "end",
                        maxLines: 3,
                        textStyle: {
                          color: "#b3bac8",
                        },
                      },
                      hAxis: {
                        gridlines: {
                          color: "transparent",
                        },
                        textStyle: {
                          color: "#b3bac8",
                        },
                      },
                      vAxis: {
                        gridlines: {
                          color: "transparent",
                        },
                        textStyle: {
                          color: "#b3bac8",
                        },
                        baselineColor: "transparent",
                      },
                      lineWidth: 3,
                      animation: {
                        duration: 500,
                        easing: "out",
                        startup: true,
                      },
                      colors: window.chartColors,
                    };
                    var lineChartObj = {
                      id: "linechart" + msgData.messageId,
                      data: data,
                      options: options,
                      type: "linechart",
                    };
                    available_charts.push(lineChartObj);
                    var container = document.getElementById(
                      "linechart" + msgData.messageId
                    );
  
                    var chart = new google.visualization.LineChart(container);
                    chart.draw(data, options);
                    //window.linechartCount = window.linechartCount + 1;
                  }
                }, 150);
              } else if (graphLibGlob === "d3") {
                setTimeout(function () {
                  var dimens = {};
                  dimens.outerWidth = 380;
                  dimens.outerHeight = 350;
                  dimens.innerWidth = 230;
                  dimens.innerHeight = 250;
                  dimens.legendRectSize = 15;
                  dimens.legendSpacing = 4;
                  var _linechartObj = {
                    id: "linechart" + msgData.messageId,
                    data: msgData,
                    type: "linechart",
                  };
                  available_charts.push(_linechartObj);
                  //  KoreGraphAdapter.drawD3lineChart(msgData, dimens, '#linechart'+window.linechartCount, 12);
                  KoreGraphAdapter.drawD3lineChartV2(
                    msgData,
                    dimens,
                    "#linechart" + msgData.messageId,
                    12
                  );
                  //window.linechartCount = window.linechartCount + 1;
                }, 250);
                /*                    setTimeout(function(){
                                                      $('.chat-container').scrollTop($('.chat-container').prop('scrollHeight'));
                                                      handleChartOnClick();
                                                  },300);*/
              }
              setTimeout(function () {
                $(".chat-container").scrollTop(
                  $(".chat-container").prop("scrollHeight")
                );
                handleChartOnClick();
              }, 200);
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.formData &&
              msgData.message[0].component.payload.formData.renderType ===
                "inline"
            ) {
              msgData.renderType = "inline";
              messageHtml = me.renderWebForm(msgData, true);
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type == "live_agent"
            ) {
              msgData.fromAgent = true;
  
              if (
                msgData.message[0].component &&
                msgData.message[0].component.payload
              ) {
                msgData.message[0].cInfo.body =
                  msgData.message[0].component.payload.text || "";
              }
              messageHtml = $(me.getChatTemplate("message")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              (msgData.message[0].component.payload.template_type ==
                "daterange" ||
                msgData.message[0].component.payload.template_type ==
                  "dateTemplate" ||
                (msgData.message[0].cInfo.body &&
                  msgData.message[0].cInfo.body.indexOf &&
                  msgData.message[0].cInfo.body.indexOf("clockPicker") > -1))
            ) {
              if (chatContainerConfig && chatContainerConfig.pickerMainConfig) {
                var pickerConfig = {};
                pickerConfig = chatContainerConfig.pickerMainConfig;
                if (
                  msgData.message[0].component.payload.template_type ==
                  "daterange"
                ) {
                  msgData.message[0].cInfo.body =
                    msgData.message[0].component.payload.text_message;
                  pickerConfig[1].dateRangeConfig.format =
                    msgData.message[0].component.payload.format;
                  pickerConfig[1].dateRangeConfig.startDate =
                    msgData.message[0].component.payload.startDate;
                  pickerConfig[1].dateRangeConfig.endDate =
                    msgData.message[0].component.payload.endDate;
                  if (msgData.message[0].component.payload.title) {
                    pickerConfig[1].daterangepicker.title =
                      msgData.message[0].component.payload.title;
                  }
                  // $('.typingIndicatorContent').css('display', 'block');
                  if (!msgData.fromHistory) {
                    KorePickers.prototype.showDateRangePicker(pickerConfig);
                  }
                  // $('.typingIndicatorContent').css('display', 'none');
                }
                console.log(JSON.stringify(msgData.message));
                if (
                  msgData.message[0].component.payload.template_type ==
                  "dateTemplate"
                ) {
                  msgData.message[0].cInfo.body =
                    msgData.message[0].component.payload.text_message;
                  pickerConfig[1].dateConfig.format =
                    msgData.message[0].component.payload.format;
                  pickerConfig[1].dateConfig.startDate =
                    msgData.message[0].component.payload.startDate;
                  pickerConfig[1].dateConfig.showdueDate =
                    msgData.message[0].component.payload.showdueDate;
                  pickerConfig[1].dateConfig.endDate =
                    msgData.message[0].component.payload.endDate;
                  // pickerConfig.dateConfig.selectedDate="Selected Date";
                  // pickerConfig.dateConfig.selectedDate=msgData.message[0].component.payload.selectedDate;
                  // if(msgData.message[0].component.payload.showdueDate){
  
                  //     pickerConfig.dateConfig.paymentDue="Payment Due Date";
  
                  //     pickerConfig.dateConfig.paymentDue=msgData.message[0].component.payload.paymentDue;
                  // }
  
                  if (msgData.message[0].component.payload.title) {
                    pickerConfig[1].datepicker.title =
                      msgData.message[0].component.payload.title;
                  }
  
                  // $('.typingIndicatorContent').css('display', 'block');
                  if (!msgData.fromHistory) {
                    KorePickers.prototype.showDatePicker(pickerConfig);
                  }
                  // $('.typingIndicatorContent').css('display', 'none');
                }
                if (msgData.message[0].cInfo.body.indexOf("clockPicker") > -1) {
                  if (!msgData.fromHistory) {
                    KorePickers.prototype.showClockPicker(pickerConfig);
                  }
                }
              }
  
              //to render message bubble even in datepickers case
              messageHtml = $(me.getChatTemplate("message")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
              });
            } else {
              messageHtml = $(me.getChatTemplate("message")).tmpl({
                msgData: msgData,
                helpers: helpers,
                extension: extension,
                extractedFileName: _extractedFileName,
              });
            }
  
            //For Agent presence
            if (msgData.type === "bot_response") {
              if (
                msgData.message[0] &&
                msgData.message[0].component &&
                msgData.message[0].component.payload &&
                msgData.message[0].component.payload.template_type == "live_agent"
              ) {
                $(".kore-chat-window").addClass("agent-on-chat");
              } else {
                $(".kore-chat-window").removeClass("agent-on-chat");
              }
            }
          }
          _chatContainer.find("li").attr("aria-live", "off");
          //_chatContainer.find('li').attr('aria-hidden','true');//for mac voiceover bug with aria-live
  
          if (
            msgData &&
            msgData.message[0] &&
            msgData.message[0].component &&
            msgData.message[0].component.payload &&
            msgData.message[0].component.payload.sliderView &&
            !msgData.message[0].component.payload.fromHistory &&
            !msgData.fromHistory
          ) {
            bottomSliderAction("show", messageHtml);
          } else {
            //ignore message(msgId) if it is already in viewport
            if (
              $(".kore-chat-window .chat-container li#" + msgData.messageId)
                .length < 1 ||
              msgData.renderType === "inline"
            ) {
              if (msgData.type === "bot_response" && msgData.fromHistorySync) {
                var msgTimeStamps = [];
                var msgEles = $(".kore-chat-window .chat-container>li");
                if (msgEles.length) {
                  msgEles.each(function (i, ele) {
                    msgTimeStamps.push(parseInt($(ele).attr("data-time")));
                  });
                  var insertAtIndex = findSortedIndex(
                    msgTimeStamps,
                    msgData.createdOnTimemillis
                  );
  
                  if (insertAtIndex > 0) {
                    var insertAfterEle = msgEles[insertAtIndex];
                    if (insertAfterEle) {
                      $(messageHtml).insertBefore(insertAfterEle);
                    } else {
                      _chatContainer.append(messageHtml);
                    }
                  } else {
                    _chatContainer.prepend(messageHtml);
                  }
                } else {
                  _chatContainer.append(messageHtml);
                }
              } else {
                _chatContainer.append(messageHtml);
              }
            }
          }
          me.handleImagePreview();
  
          //me.formatMessages(messageHtml);
          if (me.chatPSObj && me.chatPSObj.update) {
            me.chatPSObj.update();
          }
          _chatContainer.animate(
            {
              scrollTop: _chatContainer.prop("scrollHeight"),
            },
            100
          );
          if (
            msgData.type === "bot_response" &&
            me.isTTSOn &&
            me.config.isTTSEnabled &&
            !me.minimized &&
            !me.historyLoading
          ) {
            if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.template_type ===
                "live_agent" &&
              msgData.message[0].component.payload.text
            ) {
              _txtToSpeak = msgData.message[0].component.payload.text;
            } else if (
              msgData.message[0] &&
              msgData.message[0].component &&
              msgData.message[0].component.type === "template"
            ) {
              _txtToSpeak = "";
            } else {
              try {
                _txtToSpeak = msgData.message[0].component.payload.text
                  ? msgData.message[0].component.payload.text.replace(
                      /\r?\n/g,
                      ". ."
                    )
                  : "";
                _txtToSpeak = helpers.checkMarkdowns(_txtToSpeak);
                // replacing extra new line or line characters
                _txtToSpeak = _txtToSpeak.replace("___", "<hr/>");
                _txtToSpeak = _txtToSpeak.replace("---", "<hr/>");
              } catch (e) {
                _txtToSpeak = "";
              }
            }
            if (
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              msgData.message[0].component.payload.speech_hint
            ) {
              _txtToSpeak = msgData.message[0].component.payload.speech_hint;
            }
            if (me.config.ttsInterface && me.config.ttsInterface === "webapi") {
              _ttsConnection = me.speakWithWebAPI(_txtToSpeak);
            } else if (
              me.config.ttsInterface &&
              me.config.ttsInterface === "awspolly"
            ) {
              if (!window.speakTextWithAWSPolly) {
                console.warn(
                  "Please uncomment amazon polly files 'plugins/aws-sdk-2.668.0.min.js' and'plugins/kore-aws-polly.js' in index.html"
                );
              } else {
                speakTextWithAWSPolly(_txtToSpeak);
              }
            } else if (
              !_ttsConnection ||
              (_ttsConnection.readyState && _ttsConnection.readyState !== 1)
            ) {
              try {
                _ttsConnection = createSocketForTTS();
              } catch (e) {
                console.log(e);
              }
            } else {
              socketSendTTSMessage(_txtToSpeak);
            }
          }
        };
  
        chatWindow.prototype.pushTorenderMessagesQueue = function (msgItem) {
          var me = this;
          if (!me.renderMessagesQueue) {
            me.renderMessagesQueue = [];
          }
          me.renderMessagesQueue.push(msgItem);
          if (!me.renderEventLoop) {
            me.startRenderEventLoop();
          }
        };
        chatWindow.prototype.startRenderEventLoop = function () {
          var me = this;
          me.msgRenderingProgress = false;
          me.renderEventLoop = setInterval(function () {
            console.log("Running Event loop");
            me.checkForMsgQueue();
          }, 500);
        };
        chatWindow.prototype.checkForMsgQueue = function () {
          var me = this;
          if (me.renderMessagesQueue.length && !me.msgRenderingProgress) {
            var tempData = me.renderMessagesQueue.shift();
            var delay = 0;
            if (
              tempData.message &&
              tempData.message.length &&
              tempData.message[0] &&
              tempData.message[0].component &&
              tempData.message[0].component.payload &&
              tempData.message[0].component.payload.renderDelay
            ) {
              delay = tempData.message[0].component.payload.renderDelay || 0;
            }
            me.msgRenderingProgress = true;
            setTimeout(function () {
              me.renderMessage(tempData);
              me.msgRenderingProgress = false;
            }, delay);
          }
          if (
            !me.renderMessagesQueue.length &&
            !me.msgRenderingProgress &&
            me.renderEventLoop
          ) {
            clearTimeout(me.renderEventLoop);
            me.renderEventLoop = false;
          }
        };
  
        chatWindow.prototype.formatMessages = function (msgContainer) {
          /*adding target to a tags */
          $(msgContainer).find("a").attr("target", "_blank");
        };
  
        chatWindow.prototype.openPopup = function (link_url) {
          var me = this;
          var popupHtml = $(me.getChatTemplate("popup")).tmpl({
            link_url: link_url,
          });
          $(me.config.container).append(popupHtml);
          me.popupOpened = true;
          me.bindIframeEvents($(popupHtml));
        };
  
        chatWindow.prototype.openExternalLink = function (link_url) {
          var me = this;
          var a = document.createElement("a");
          $(me.config.container).append(a);
          a.href = link_url;
          a.target = "_blank";
          a.rel = "noopener noreferrer"; //for tabnabbing security attack
          a.click();
          $(a).remove();
        };
  
        chatWindow.prototype.getChatTemplate = function (tempType) {
          var chatFooterTemplate =
            '<div class="footerContainer pos-relative"> \
                      {{if userAgentIE}} \
                      <div role="textbox" class="chatInputBox inputCursor" aria-label="Message" aria-label="Message" contenteditable="true" placeholder="${botMessages.message}"></div> \
                      {{else}} \
                      <div role="textbox" class="chatInputBox" contenteditable="true" placeholder="${botMessages.message}"></div> \
                      {{/if}} \
                  <div class="attachment"></div> \
                  {{if isTTSEnabled}} \
                      <div class="sdkFooterIcon ttspeakerDiv ttsOff"> \
                          <button class="ttspeaker" title="Talk to speak"> \
                              <span class="ttsSpeakerEnable"></span> \
                              <span class="ttsSpeakerDisable"></span> \
                              <span style="display:none;"><audio id="ttspeaker" controls="" autoplay="" name="media"><source src="" type="audio/wav"></audio></span>\
                          </button> \
                      </div> \
                  {{/if}} \
                  {{if isSpeechEnabled}}\
                  <div class="sdkFooterIcon microphoneBtn"> \
                      <button class="notRecordingMicrophone" title="Microphone On"> \
                          <i class="microphone"></i> \
                      </button> \
                      <button class="recordingMicrophone" title="Microphone Off" > \
                          <i class="microphone"></i> \
                          <span class="recordingGif"></span> \
                      </button> \
                      <div id="textFromServer"></div> \
                  </div> \
                  {{/if}}\
                  {{if isPaperclipEnabled}} \
                    <div class="sdkFooterIcon"> \
                        <button class="sdkAttachment attachmentBtn" title="${botMessages.attachmentText}"> \
                            <i class="paperclip"></i> \
                        </button> \
                        <input type="file" name="Attachment" class="filety" id="captureAttachmnts"> \
                    </div> \
                  {{/if}} \
                  {{if !(isSendButton)}}<div class="chatSendMsg">${botMessages.entertosend}</div>{{/if}} \
              </div>';
  
          var chatWindowTemplate;
          var hostnameGTLOrUNL = new URLSearchParams(window.location.search).get("botHost");
          hostnameGTLOrUNL="GTL";
  
          if (hostnameGTLOrUNL == "GTL") {
            chatWindowTemplate =
              '<script id="chat_window_tmpl" type="text/x-jqury-tmpl"> \
                  <div class="kore-chat-window droppable liteTheme-one" ondrag="return false" ondrop="return false"> \
                  <div class="kr-wiz-menu-chat defaultTheme-kore">\
                  </div>\
                      <div class="minimized-title" id="minimizedTitle">\
                        <span class="close-btn-info" id="closeBtnInfo" onClick="closeTitle()">&times;</span> \
                        <p>Hi! Click the chat button below </br> if you have any questions!</p> \
                      </div> \
                      <div id="minimizedChatIcon"><img class="minimized" onClick="closeTitle()" src="data:image/png;base64,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"></div> \
                      <div class="kore-chat-header"> \
                          <div class="lefti"></div>\
                          <div id="botHeaderTitle" aria-labelledby="botHeaderTitle" class="header-title" title="${chatTitle}">${chatTitle}</div> \
                          <div class="chat-box-controls"> \
                              {{if botMessages.availableLanguages}}\
                                  <select class="lang-selector" >\
                                      {{each(key, lang) botMessages.availableLanguages}} \
                                          <option  {{if botMessages.selectedLanguage===lang}}selected{{/if}} value="${lang}">${lang}</option>\
                                      {{/each}}\
                                  </select>\
                              {{/if}}\
                              <button class="reload-btn"  title="${botMessages.reconnectText}"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTNweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTMgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5yZWxvYWQ8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNTcuMDAwMDAwLCAtMjQxLjAwMDAwMCkiIGZpbGw9IiM4QTk1OUYiIHN0cm9rZT0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJyZWxvYWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM1OC4wMDAwMDAsIDI0Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC44LDUuMjczNTc2NTggQzEwLjgsMi4zNjU3MTQyIDguMzc3NTg1NzEsMCA1LjQwMDAyMzg3LDAgQzIuNDIyNDYyMDMsMCAwLDIuMzY1NzE0MiAwLDUuMjczNTc2NTggQzAsNS40NDYzMTE0MiAwLjE0MzQwNjM1Myw1LjU4NjM1OTc2IDAuMzIwMjgyOTQyLDUuNTg2MzU5NzYgQzAuNDk3MTU5NTMsNS41ODYzNTk3NiAwLjY0MDU2NTg4Myw1LjQ0NjI4ODEgMC42NDA1NjU4ODMsNS4yNzM1NzY1OCBDMC42NDA1NjU4ODMsMi43MTA2NDc2NSAyLjc3NTY0MjI2LDAuNjI1NTg5NjY4IDUuNCwwLjYyNTU4OTY2OCBDOC4wMjQzNTc3NCwwLjYyNTU4OTY2OCAxMC4xNTk0MzQxLDIuNzEwNjcwOTYgMTAuMTU5NDM0MSw1LjI3MzU3NjU4IEMxMC4xNTk0MzQxLDcuODM2NDU4ODkgOC4wMjQzNTc3NCw5LjkyMTU0MDE4IDUuNCw5LjkyMTU0MDE4IEw0Ljg0NDMyNzI0LDkuOTIxNTQwMTggTDUuNjM4ODc1MzEsOS4wNTI5NzAwMyBDNS43NTY3MzczMyw4LjkyNDE1OTEyIDUuNzQ1MzAyMDYsOC43MjY0MDgxNiA1LjYxMzQwMjYsOC42MTEzMDYgQzUuNDgxNTAzMTMsOC40OTYyMDM4NSA1LjI3ODk4NjcyLDguNTA3Mzk0NjYgNS4xNjExNDg1Nyw4LjYzNjIwNTU2IEw0LjAyNTM1Njg4LDkuODc3ODAyNzYgQzMuODM5NDMyMzUsMTAuMDgxMDU1OSAzLjgzOTQzMjM1LDEwLjM4NzU5MDggNC4wMjUzNTY4OCwxMC41OTA4NDQgTDUuMTYxMTQ4NTcsMTEuODMyNDQxMiBDNS4yMjQ0MzY0NCwxMS45MDE2Mzc3IDUuMzEyMDc0OTgsMTEuOTM2ODQyMSA1LjQwMDExOTM3LDExLjkzNjg0MjEgQzUuNDc2MDYwMDQsMTEuOTM2ODQyMSA1LjU1MjMxMTA2LDExLjkxMDU5MDMgNS42MTM0MDI2LDExLjg1NzM0MDcgQzUuNzQ1MzI1OTQsMTEuNzQyMjM4NiA1Ljc1NjczNzMzLDExLjU0NDQ4NzYgNS42Mzg4NzUzMSwxMS40MTU2NzY3IEw0Ljg0NDMyNzI0LDEwLjU0NzEwNjUgTDUuNCwxMC41NDcxMDY1IEM4LjM3NzU4NTcxLDEwLjU0NzEwNjUgMTAuOCw4LjE4MTM5MjM0IDEwLjgsNS4yNzM1NzY1OCBaIiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="></button> \
                              <button class="minimize-btn" title="${botMessages.minimizeText}"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIycHgiIHZpZXdCb3g9IjAgMCAxNCAyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1Mi4zICg2NzI5NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+bWluaW1pemU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjYuMDAwMDAwLCAtMjMzLjAwMDAwMCkiIGZpbGw9IiM4QTk1OUYiPgogICAgICAgICAgICA8ZyBpZD0ibWluaW1pemUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyNi4wMDAwMDAsIDIzMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBwb2ludHM9IjAgMCAxMy45Mzk5OTk2IDAgMTMuOTM5OTk5NiAxLjk5OTk5OTk0IDAgMS45OTk5OTk5NCI+PC9wb2x5Z29uPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="></button> \
                              <button class="expand-btn" style="display:none;" title="${botMessages.expandText}"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5leHBhbmQ8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMDUuMDAwMDAwLCAtMjUyLjAwMDAwMCkiIGZpbGw9IiM4QTk1OUYiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSJleHBhbmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwNS4wMDAwMDAsIDI1Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xLjg2NjY2NjY3LDkuMzMzMzMzMzMgTDAsOS4zMzMzMzMzMyBMMCwxNCBMNC42NjY2NjY2NywxNCBMNC42NjY2NjY2NywxMi4xMzMzMzMzIEwxLjg2NjY2NjY3LDEyLjEzMzMzMzMgTDEuODY2NjY2NjcsOS4zMzMzMzMzMyBaIE0wLDQuNjY2NjY2NjcgTDEuODY2NjY2NjcsNC42NjY2NjY2NyBMMS44NjY2NjY2NywxLjg2NjY2NjY3IEw0LjY2NjY2NjY3LDEuODY2NjY2NjcgTDQuNjY2NjY2NjcsMCBMMCwwIEwwLDQuNjY2NjY2NjcgWiBNMTIuMTMzMzMzMywxMi4xMzMzMzMzIEw5LjMzMzMzMzMzLDEyLjEzMzMzMzMgTDkuMzMzMzMzMzMsMTQgTDE0LDE0IEwxNCw5LjMzMzMzMzMzIEwxMi4xMzMzMzMzLDkuMzMzMzMzMzMgTDEyLjEzMzMzMzMsMTIuMTMzMzMzMyBaIE05LjMzMzMzMzMzLDAgTDkuMzMzMzMzMzMsMS44NjY2NjY2NyBMMTIuMTMzMzMzMywxLjg2NjY2NjY3IEwxMi4xMzMzMzMzLDQuNjY2NjY2NjcgTDE0LDQuNjY2NjY2NjcgTDE0LDAgTDkuMzMzMzMzMzMsMCBaIiBpZD0iU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button>\
                              <button class="close-btn" title="Clicking on close will end the Chatbot session"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5jbG9zZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM0NC4wMDAwMDAsIC0yMjkuMDAwMDAwKSIgZmlsbD0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJjbG9zZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ0LjAwMDAwMCwgMjI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjE0IDEuNCAxMi42IDAgNyA1LjYgMS40IDAgMCAxLjQgNS42IDcgMCAxMi42IDEuNCAxNCA3IDguNCAxMi42IDE0IDE0IDEyLjYgOC40IDciPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button> \
                          </div> \
                      </div> \
                      <div class="kore-chat-header historyLoadingDiv"> \
                          <div class="historyWarningTextDiv displayTable"> \
                              <span><img class = "loadingHistory" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjciIHN0cm9rZT0iIzIxNzRGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LjcgMy4wIi8+Cjwvc3ZnPg=="></span> \
                              <p class="headerTip warningTip">${botMessages.loadinghistory}</p> \
                          </div> \
                      </div> \
                      <div class="kore-chat-header trainWarningDiv"> \
                          <div class="trainWarningTextDiv displayTable"> \
                              <span class="exclamation-circle"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span> \
                              <p class="headerTip warningTip">Something went wrong.Please try again later.</p> \
                          </div> \
                      </div> \
                      <div role="log" aria-live="polite" aria-atomic="true" class="kore-chat-body"> \
                          <div class="errorMsgBlock"> \
                          </div> \
                          <ul class="chat-container"></ul> \
                      </div> \
                      <div class="typingIndicatorContent"><div style="background-image:url(data:image/png;base64,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)"></div><div class="movingDots"></div></div> \
                      <div class="kore-chat-footer disableFooter">' +
              chatFooterTemplate +
              '{{if isSendButton}}<div class="sendBtnCnt"><button class="sendButton disabled" type="button"><img style="height: 36px;" src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZGF0YS1uYW1lPSJMYXllciAyIj48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIj48L3BhdGg+PHBhdGggZD0iTTEgMTJDMSA0IDQgMSAxMiAxczExIDMgMTEgMTEtMyAxMS0xMSAxMVMxIDIwIDEgMTIiIGZpbGw9IiMyMTc0ZmYiIGNsYXNzPSJmaWxsLTAwYWJlOCI+PC9wYXRoPjxwYXRoIGQ9Ik0xNyA3IDYuMjUgMTEuNTRhLjQyLjQyIDAgMCAwIDAgLjc4bDIgLjYzYTIuMTkgMi4xOSAwIDAgMCAxLjg5LS4yOWw0LjUzLTMuMTNhLjE2LjE2IDAgMCAxIC4yLjI0bC0zLjQ3IDMuMzJhLjg0Ljg0IDAgMCAwIC4xMSAxLjI5bDMuNzMgMi41MmEuODQuODQgMCAwIDAgMS4yOS0uNTZMMTggNy44YS43My43MyAwIDAgMC0xLS44WiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGFzcz0iZmlsbC1mZmZmZmYiPjwvcGF0aD48L2c+PC9zdmc+"></img></button></div>{{/if}}</div> \
                      <div id="myModal" class="modalImagePreview">\
                           <span class="closeImagePreview">&times;</span>\
                           <div class="image-preview">\
                              <img class="modal-content-imagePreview" id="img01">\
                           </div>\
                           <div id="caption"></div>\
                      </div>\
                      <div id="chatBodyModal" class="chatBodyModal animate-bottom">\
                      <span class="closeChatBodyModal" aira-label="Close Form" role="button" tabindex="0" aria-atomic="true"></span>\
                      <div id="closeInlineModel" class="loading_form iframeLoader"></div>\
                      <div id="chatBodyModalContent"></div>\
                      </div>\
                      <div id="myPreviewModal" class="modalImagePreview">\
                            <span class="closeElePreview">&times;</span>\
                            <div class="largePreviewContent"></div>\
                      </div>\
                      <div class="kr-wiz-content-chat defaultTheme-kore">\
                      </div>\
                  </div> \
              </script>';
          } else if (hostnameGTLOrUNL == "UNL") {
            chatWindowTemplate =
              '<script id="chat_window_tmpl" type="text/x-jqury-tmpl"> \
                  <div class="kore-chat-window droppable liteTheme-one"> \
                  <div class="kr-wiz-menu-chat defaultTheme-kore">\
                  </div>	\
                      <div class="minimized-title"></div> \
                      <div><img class="minimized" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAAC+CAYAAACLdLWdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAACnvSURBVHhe7Z0LsFzVlZ4NQkhCMgiweGPxNDaYh8GAAQlRsRM7MJWBSXkelbFHPDKuxC57UjWpytQwhrEH51GegEMgwS4/Eso2AVwzU8YPEbvGIzx24sFgmUFBZrCDQBlTPKQrCV0kYd/83+q1Dqe79+nH7e7Tfe/df9Wv0+rbfR57/3vttdZe5/TrMoaDmZmZk8QrxPXizb/85S8/7/xL8WfO7fpbEvzNP/OoyHf+TLxNf7pZZJ/s+yQ/XEZGvZD4ViJCifL3RISNUCsFPWxwLDEGxu/pLQbESj+9jIzhAFGJV0tkt4mP6vVEgnPjHPXyajEPhIz+IeFg0W8S/xJRzUX4ueMmneeXlZHRDgkEsWPVa3Nb6oKuidjh83p5hV9uxkKGhLBSgsCyzzuxV8EHwU16mQPlhQZ1OtZ9qG7M1PTMzOZtMzP3/2Bm5nMbZ2Y+9hczM79/z8zMb/2XmZmr/uPMzNpbGjz599M8948af+ezfOcDX2jsg309+Fhj3xxjmPA2WO/NkjEfoQ4emnV/5qWGGBEmAu0k6GEzBsZtGxrnwLkMCrXJz7QhZZpngfkCdebAgkdcWHIseJ0i75VrP9E4t/v/ZrCBwAAQb9XLPADmKnbs2HH4IIL/X3/XsOiTKPRuZFbg3LmG2SIPgDkGddbhv/jFL1g57VvwIXb87ZSg5iJjNpjNIFAbWiDsTZsxoThAfbVeov+/jW7rDQSMtz3YsJIp4cwnMghm4w4xALTJQfCkQZ1ynjqnrywNFvB3Pz+/rHs/nM0soDZm5Rr354BGy2eMBfjxsvAs0/cMOpusSEoMC5G0BbNAP8CV1CaLfxxQw5OLZwruCVnwnRluUK/wtmclOA+AOqDG7svKZ8H3x34HANZf3ZLFPyqojQleT1JD/8havAse35YFPwh/9wu9B8Fu/XPqcxRQ41L/3jVFSZaGlGSqMzP7J23ZywCgb+gjvczWfwjAyrPyymJKVzz4tws3SzNK9uP+4IZ6vxkb3ZjRM2i06enpkyX6rjd/YJGyWzN6kgLt0fqXXZ8s/l6gBqOhDti7d+/bZD26LkZlK18ve7X+JfFn4feIA9RovyN29OezLz9e0vZTe7wzKkAf7t+//xr6tNG1GW1QO5mlV2MRIHUE0y2WJ9UhmfWRPujF9fGUZ0Yr1DYmehqo0VTVuE/TbHZtJof0RS+uj4s/W/4SwtJzO1xH3Loh3fiZ4yeFft1QEv/CHgBqC0t5dbP0+PNkFFINnjk5pI+6+f3y+f9YXX+guKDFfyAN4W2SBD7kVbemGzpz8kh5dze/Pyy/Xi448R9w0003HdjN0ucgdm6yl6AXg4cGEIP+uyAGgPl4vVj6LPq5y17E/+qrr/4rbRaE5Q/RX2NXXoEs+vnBXsS/d+/ea6UJ8/n133k5AEz0zz333KmdFqey6OcXu4kfLezevfv8cHvmIw5E9PLrK8sQsujnJ3sQ/8927NhxynwUP9Z+URb9wmU38UsbP9q8efOR0sm8EL+5NyJpy0/5NbaBPH1OWc5/kurslOdHI2jFOWcRwcqBHr1XIi9OLRzS152AVtCMXprR9O2cgom+WzCbyxAWHjuVN6AV/H30o//OOdG/zgOVjn49xU2phsmc/6TYsApz1d+3VVnYaZGKQCdXWS5c0vedgl38fTee4fZMNvwkD5yenv4HdgUJEMzmDE4mGugU7KIhaWkRehInVvycmIlePKiTi5PvnMoMooUqkN8vuTyhr4mDnVg3Fyf79Zmt5AcuqlB2eUxlE4Yidfncc8+d1jjlduRFqswUu/n7O3bsuEDaWqSXk2XxOSEflbg4lU86y/n6zCryeJgqSFPfQVsi/v5kiF/nZS6OSEB7feNU25FdnMxu7OTy7N279zpprAh09dZYB0CInhNaXBXQZhcnsxfi8lRleQh0H3744TeU/P2xC5+TWKQR+TE/xzbkLE5mr+yU5VGg+zFpDZfH1on01tjEb9b+mWeeOb2TtU9dYGZmFXnSdQqUMzzyyCOr3vve94bLUzsQvIlePOiVV1653c+tDfzcTuriMjOr2CnQlWfx8XXr1o010D2QE3jqqafe5OfUhhzQZs6WVb/PhdXfuHHjKunPXB5TYo0wv15c3Mna54A2c7bsZvWlvYNdg/VYfR2XAxXWvsq3z9Y+c1B2svobNmw4SjoMX78W8ZvwxcW7d+++wc+lDdnaZw7KXqy+B7qjFb6OV1h7bZdMqrU/58ZGWmzDY52XwjPSIKtC27HSvuaWdBvXxU5WHw2KB3luf6TiZ+fm2+/cufOf+zm04TfvTF/EqInguaOr2/MbM/rDfT8Y3wDoZPWfe+65fyQtmq+v/6LN0Yjfp5WDzjzzzIP379+/sXH4ZnxfIzR1AaMmgy0LfnR45sXxpaarrP6rr776V6tXr16KJt3qjwQHIPwLLrhg8aZNm87wY7dhHIVonVb7MoaLcfQvPz1ahXvvvfcYaTN8/aGLP1ycRaeddtqSl19+WRNfO8axSosVyqgXdVv+TjU809PTfyJdLvG4c+hlDCZ8rL22SyclqMXvZArOqBeI8Jya75euejKDtLjjhBNOWCZdLg6rr7eHIn52whRyENZ+27Zt724csh11pzAJujLGA9o+1SejIg+jqgKalD4tw+NaHRiIPoS/mJG1b9++u/14Tag7qMXaZ4wXdVv9qiB3z549d0ify/BIcHkGDnS1TxO+TyGkjQ6pcnPqDnpyQDt+fOzP030zKlb1Oe7OscceewjZRmn0IL0VBhvOGubmkDbavHnzJY1DtaNuN6dq9GfUh7pneYLcKmzduvU90ulSj0PR7Ozv0mLKCGuPm1OVzRlH7j7n7McPEgupvhklqwzerl27PuFB7sDFa+HiWHmCuHzv3r0P+XGaUPeUBzMmA6m+GSWr3B20iUZJwJStvtg3+JK5OeKyT3/60yf4MdpAxJ06yVEyYzKQ6ptRcm2HpAYaRatiWfh9i58vRFC7bNu2bb/l+2/CuG4tzJgMpPpm1KwqPESj0uohaNYXtGYlfLP2TB2rVq1aQcrI99+EcVViZkwGUn0zaqK5FHbv3n0nWpVui6pNvd278PkwX8JX8iKg1+/fv//HtvcWjOshURmTgVTfjJpoLgU0ilbRrPv5EeT2LP5y7n7ZHXfccaLvuw3juuEkYzKQ6ptRs5Of/8lPfvJEadbcHREN47n0jAhq+fLyLVu2XOX7bcI4Hx2SMRlI9U0drPLz0erRRx+9XLotCtfEnsC0EGlMc3Neeumlf+P7bQKPfEudVB3MmAyk+qYOcodYCi+88MIfHHnkka9Huy1pza7uDh/gw3wJ4R86PT39Nd9vE24b4+9XZUwGUn1TB6vy+Qpwv4RmRVvMcpe9q/DjA+bfU/+g7WFVC1fjusUQZkwGUn1TB6tuTtm3b99jRxxxBMIPP7/7Pbn6Hn/kQxHYkho6nCKgxm6bMY6Fq2DGZCDVN3WwKsBFq2iWtCap+J5uUPE/lt2cFffee+95tscWUCuTOqG6OGxQA8L0SYPGMRjYpM6qAqnZYNTHqes6AnGMcbCqXusrX/nKudKu+fmu5Y4WP6rZIrDFRzp006ZN/6Sxu2bwCIrUydTFYYEfokMoqWOUyWcGKYwb9XHquo5WpI5RF6seLotmCXDjzizXNNpOit8WrTwY4MOHHH744Ydt3br1Q76/JowzowOHAcRy1a3p/aeI5ZytKEd5nLquI4XU/uti1QoumpV+D0PDIqu4aLrS3eHNEL5VY4orX3rppX/f2F0zPrsxfTJ1cRjoxUK2ku/0i1Efp67rSCG177r4ueQDbiyl+R8OO+ywleTz8fOl48jnJ4Vv9fceDCzxRYDDt2/ffpfvrwnjKEUuc1AMsvjWz00woz5OXddRhdR+62LV4N25c+eXJfzDcXcoXyjdjlht8cVi4Uo8Ys+ePV/3/TVh3M+9HxSD1Bj1Yy1HfZy6rqMKqf3WRa49hampqXvQrmu4pwDXCtO0NeELR05PT/+1768J48zhw0GBn5vaby/sVCvSilEfp67rqEJqv3Wx6vGCr7zyyl+jXc/nl+vz26HPMxri2TnLCGy1fYN28reN3TVjkAYfBgdFap/9sFekvtsPuyH1nX44KFL7rItXSoMp7N+/fyvaFSPAtYK1KnfHAlu/U91WbMWjtJNnfH9NKOeJx8FBkdpnP+wVqe/2w25IfacfDorUPuti1Yzlwl/lxnu5a7rywbIHeGB7cAS24lGvvvrqVGN3zaj7mSqtHBSDDNwqS5PCqI9T13VUIbXfulglfDSLdglwtbVKTbHyxhSmgXIqky8d3dhVO1InUicHxSBZqaqgKoVRH6eu66hCar91sgrLly8/2jVM2Y1ldrRt9/P1WUZCBLYrGC2HHHLIMY3dtCN1EnVyUAzySJR+ntc56uPUdR1VSO23TlZBGj4GDfutiGi6MpfPG5HKXHHooYceMZ+FD2ZjLWeTAhz1ceq6jhRS+66TVZCGj0HD2nZNafKmWXwv5D9i2bJlx/l+2pA6iTo5DLBsj5+b2n+KfHZWJQsjPk5d15FCav91sgrS77FipDQL4etPTcLnP003l/tomdfCBwigF4uJhRxELKM+Tl3X0YrUMepkFeStIHyz+FGs1pbO1OdM+CJpn2WMEhYA9HreCz+Av0uwd+WfvnYMsgYIBT96WBj1ceq6jkAcY1ysAtoV0fCh3FCFUS/djVWA//Bm3HXF9MACwPGkhnxfTRgkjTYMZkwGUn1TF6seIotm0a6I8GMRC1fHqjTFQvxNjxMRC+HP1wWsjOEg1Td1EQ2msG/fvmekXSy+rd7GUxdEs/j6yAHh5oTFZ1TEqu0bFNxWCn+ulyxkDAepvqmLBOkpTE9PPy798hxNhF/cf+vGvdLih/BXicfv3r37+76/Jsz1IrWM4SDVN3Wxqkhtz54935d2Eb75+KXHh7fl8pPCl8U/4cUXX7zf99cEAqjUydTFjMlAqm/qYtWTFqamph6Ufo9fsWJF1OuYxRfN1RELFMKPR4qIWPxK4c9m0WSYzJgMpPqmLpKpSuHnP//55zDaEn5ThWarq8M/MGXxj3/66ac/5ftrwny49TBjcKT6pi5W3Xq4devW26RfsjpNPr7Y7OqQ2G+1+D5ajt+0adO/9v014f6af+6xlRmTgVTf1MWqxwiiWYy2a9iEH6XJYrOrI4bFtwUsbU343/jGN5I/CDFfHi+SMRhSfVMXqx4vsmHDht9Eu65htLysRfgm/vLzdOxH3rQ14TNqPv7xj1/e2F0zWPZOnUxdzJgMpPqmLlaVXqBZtOvVB2VX5zXh63P2wusYCovv0wSLAKfs379/Z2OXzRjnIlbGZCDVN3WwKofPqu2SJUtO8VqdEH6kMxF+aL7t0YF8iOpMvmTCf/nll/+P7bUF43zSwigeh5fRH8Y561fl8Hft2vW/pdmTS0VqIfwoWWhDCN+qM8UjNV0cp9Fz8vPPP/8V328TxpnSHMYzYTIGwyA3wQxKHlGfwvbt2/+ntHuyaML3EnsTvns1r0GfD1fHhO93rTBajpHwT9q8eXOyKmKcjxGsyuFm1IdxGr6qjM4TTzzxJ9LtarTrGm69EeU16PMNh7+R57RfOdSWO7AYNSd99atf/WeN3TaDEtjUSdXBTj/vnlEPxvX7Z7DqtskHHnjgt6XZN4p2zy1ajh+D059D5w3whlt8+3lPbbnndqW2fPmNV1999QW21wTGGeBWPTQ0Y/QY18+8wjUVVZngmmuuOX/p0qX8ABzaRcPFUxZENN4sfG1M+CLRLx8uhC+eXhXgjrNmB6s/zLuJMnoDiYVxWns0lwIaRauKTU9Yvnz5Ua7hpseLaNsG3rRcvtcvs3pLvQ6j57StW7f+d99/E8a9gltVqJQxOoz7uan3SXMpPPvss/9NWj0V4WtrBWpUIrgXE09Sa4a+h9VH+Itb7sJiJ6d+61vfSj4nf5x+frDKAmQMHyQVUn1QJ6v8ezS6ZMmSU6XXWLyKArUlXpITi7VNMOH70m6ULfBlln5PufLKKy9u7L4d474bC2L5c25/dODHJ8idp9q+TlYtXAE0ilbF4n5bcRmBLdYe6mPNwvc3zOKL5D3J7PBlMjsnH3zwwW+emppKTjLjLlEO4nfmgHe4QPC3PdiIp1JtXjer0tg7d+78gXR6hkgqM1ZtW1OZbdbe4D5QLGLZ09S0JR+6WsI/48knn7zDj9OEcS5kpMgAwP1hnWFzRSFTRjWYOWk7RDYpgg9WLVyiTen0TaKlMl278RS1eMJCO/TdIqUptmV2JPzT77333vWNw7Rj3A+RXWjECg8Lqf1PIjulMe+8885/Kp2eJhKTktFB+Obfi50tvsAfQvj242+e2bEAVzyzqmBtUtydhcRhiT+170lkVRLjlVde2SbD/BY0SlWma5bAFuNtd165UW8Xvr5fLk82P9/rHKjZsQAXP//pp5++247WgklzdxYKhyH+1H4nkVVuzrZt2/5C+kT4FtiWMjpFVWYysC2BP4S7Y8VqvhMrXRDPuOeee65tHK4d5ad3ZdbHQeqWxn1fRa/s5ObIBb+WGJS6MrRaelhsuSoTbfckfCtdEFfyrPGlS5fi5xM8nFXl7ty6IX3SmaPnbNcyJmEdphdWLVrh5kiTbyUG1bao0RFxczDeaLmjtQ+Uf+uW4IAAN1Zw8fPPeuKJJ5LV0FiPHOSOj7MR/1wRftWi1ZYtW+6UJs+MhSuxWLHV646lCq1gZBS/hdW6kEUQ8Z73vGeNH7cN417OXuhkIa+f+qW5IPxOA/ojH/nIP5Yu34w2xaaFKxENm8UXOyL8oAhwi2fl8yMR2pqfv3jx4nO2b9+eXCrKQe74yeMdexX/XBB+VVA7NTX1N9Lj2SIueLIGP0oVxJ5gfr4X9yxnMcB/UwgfilzpWXffffcNfvw2jPvxgpm9i3/ShV91iyF46KGH/kgeyJlo0kuR+cE3+yl/vTY3R0T4PSOsPlNF8Zu3ork7Iqmjc6uC3Gz1J4OIv1v90qQLv0tQey6uN5r0lLvl792/tzSm2LO1j9KFyO7gK8UvpBxLykgHoybi7M2bN/9XP482ZKs/GaR8o5P4x/18pE7slMLcuHHjR9GgGGnM8m9eWWGauzk9ZXQKIH7/iUR8JaYOc3c8rUnq6Kx3v/vda7PVn3x2Ev8k91Mna//hD3/4SsWaZ0mH4ebYHVdxq6Fe9xTUtoIRYu4O2R2mDnd3mEqK7I625z7++ON3+fm0IVv9yWGV+CdV+J2s/ZNPPvklif5c6S9Wa8tlCoWb02sasxV8iakiqjWtfMFvQLdqTW3Pfte73rUuW/25wZT4J7WPqqw9+NCHPnSVhG/ZHFn71fEMHTKQ8Sz8Wbk5wL9gfn5kd0RbxdW2yO6I52WrP3fYKv5JFD5rQVV46qmnvoTmcHPk21s1pmvSsjnh5iB8fbw/0Qf4ItMF7k48U7P8aEGRhYNzFAtcUWX1Jzl4Wqgsi38ShV+1Sjs9Pf3/PvjBD/4KmpPH8WYJ/+Rly5aVi9LCzcG/n53oHfaDEaUgt3jQlBhB7lvFtz322GOf9vNrQy5ZnjwifozSpAm/U8EdGkNr4lmuPRatojanbdFKX5m1+OPLCJ+RhLtjQa7fyU59hAW573znO69gRNoZtiDX8Ewmubtq3D/wUSYBbSdrL529vRzUugYJaotFK4z0bIPaJuiYCD+CXMvpi+VSZZaL36oTOv/b3/72HzdOsx088i11sZmZwU4BLdqSzrD2VGKWSxSsNsd9+8VDE75QviWRIBd3B6vP7V1Rscmy8bkHHXTQ21988cUf+rm2IQe6mVXsVIi2a9euLdLWhWhMfAuVmL5SayUK2mLtLagV0epA/n0BHZsdsUMrYYg7s0gjkU7Sa1Kb+Prn33LLLb/dON12MI1llyezlZ1cHPCBD3zgV9EWGsPaewqzXJDWWok5HOELIfzi2ZriShYNwtfXCYXVv/AnP/lJ5fjNLk9mKzu5OD/+8Y8/I129HW2JWHtbsBJjwcp8e3HoogcmfI+W7Ulr1OmTRvLFgyZff82aNe+qCnRBzvJkBjtlcTygvUiaepuIRxG+vS1YieW6e1uwEocufBM/wYMHEragJR7ltRIsJliGB1//rrvu+pd+/m0gy8P0lmqIzIVDNNCpdPozn/nMv5CeytaeeNIeH4Jv74+zb7L2+tpQhQ9M+GLxmEHR7s5iEUEnVbb6b+vm8mR/f2HznBs7+/W4OB7QWibHtWWZHF+wsvIE1+Ks63J6RYg/MjyF1RcZibaaK+Gfo+3bcXl27tz5E7+WNtw3xmesZ46Xnfx6d3HeIV7gWopbC8O3j5vJzdq76Idu6ZvgBzGrz4gjwxOPICHa9hU1angYqRcpIr9m3759u/ya2pCfzLDw2OlZQGjlhhtuuEbawdqfR9LENfXGRCYnHh0yeuELHMSsPhkeVsxaSpbtAbPaMlJJQV30ve997za/riTI4aYaKHP+sduTINCKNMNTj9GO3Wgi8mNu1IfZExS0XY72vJSmFtEDDgLN6hPoel6f6ccqN32EFulNbd+xZcuW/+HX1gYCHB7/nGqozPlD+rhTMItG0IqIi4O1J1nCjSbl5+W8PlZpRRO+vlqf8D21ab5++YckCHS1LQJdkZF74eWXX/4PO/n7BDo50zN/2W2Ras+ePX8vI3mJtHKRWAS0njQ5zquCsfbF83LE2qx9oPU5m5xIPHXtKBa1fKHBXB6N3gt0URdff/31v8YFNi61HVn885O9iB5toBG0Is2cjbvsGor0JdYejRUVmMSb+nqtwg9YyTIuT8nqF2XLIrl9c3lE8rHvuPnmm3+nU7CbxT+/2E30aOG6667jEd/m4rhW7JEhIhqygBZ32jVWXyanCn5wC3TFpfGjcWLK5TlPvJDp7Jvf/KaaoxpZ/POD3UQP7rnnnj+QLnBxWnP2TS4O2vJymXImZzzQeZu/Ly7icQ7a2oquT0utuX0idEY0Ptwl3/3udz/VuPQ0svjnNnsR/aOPPvpZaeFS1wSxoN1ZpW3h4oisE+Hi2CNDtEX0obvxWHwhDm5WP1wez/LEYwfN5fEInRQn4idddekjjzzyOW+DJLL45yb7FD1aQBNoA41QlkAJTOTscZ/LtxSOza9vAifhJ2L+vk9H5u/Hwpa4WoEK4j9Tlt/8fbk8+HSX0QA0RBVowJzqnDukr3oU/WUiGrC7qtCGXttClXgs2iFnH3dWiYh+vC5OBcLfZ2QupYCIQiJ8NK/lYRGiXMtjwa54WTfLT+43L3JNPumjTnl6QF+r7y8j1lPf2+qs9MBKf+HXi3Y7oYjoI2cfoh+/tS+jJdA18Yv4Zk3+vkZ23LRCIGOLW2JXyw9yecPkspefJHLRrymJnnJjUpexOotGioWqeEaOr9CGbz9x4KSKhS2vmluG5fdnGh7t+X1uWiGAMcuvLQ1wCVagm+UHFDflqs7JIVWWFBt2A32rfl5DX3uf0/dRkhDBbPH8S2JF15D59U7TmDiR4ARN/GLh74tRyBbBLuLnwq2eR+xZ/DnonQz2EsQCMnjq33BvuLEkMjitwazdOC5Gvr5YqNLriUdh+X3EWoqzdMdWZHqKeh7xfDUK0T0Ncxm53U6LXABfMt/JNT5y51Q3f54+/PrXv/4J9am5NyKiLzI4JDy0tWBWPNJ/fcf8+khdajeRPJlYS19GnChWv8jvl56zb5kejfjTRRO/N8hFbhXWrF+//r2dyhsCuD7Z+tdHXBvum+4G+u7GG2+8Tn1J9gbR496YpRfLxWfHkgBxbURJAgZzMoPZHsAJm9tDitMr6qyeR7THEFK/r21YfsvxYxW0paHWvP/97//1XsTPdJuzPqMnj4fpxbWZmpp6kr5TP5roRVugknEri56+L5caF3U4Yvj1c070IKx+Eey6+K2E2YvZrKwBy68tOX4K2gqfXyQYWrt58+b7vE07Ilv/0bBXKw/oq8suu4wfZAvRY+nNvXGf/nRE7w8piLTlisjgiOUMzpwUPmgTf2ll18SvLTevFOIX8fljddcCXnHtQw899J+6+f0Ai5R9/+GxF18e0DcbN268XX12uRjZGwtkw9LTx2VLX7phPNwbE/1cCWY7Qm3SJn4f3W3iF09XI7GYYaXM2mL5Lc8v9uz6AAZA/unR2RO35vFnvTG7oOTarMVF9T4z90ZMujfUc7nom3L1iF67nLOWvowQPmQk48ORqoonstkCFzl+bRG/lTJL+KQ6mxa5RHN9fvjDH3Z4gnozsvvTHxE8T1DuFbg2l1566ZXeN9Te0FflQJa09WlL/Of2RSs8Q/St7o12FzqZVwjhm+UXzfKXFrhoEKxBBLxvaRW/uz3m+tx+++0f6dX6gzwAOrNfwdP29IH6Jaw8hilEH4tThaUPn77k3iD6Ilev7byx9ClETjZ+WM4sv4jlL7I9IuK3RS6JnxXe89S4FLYVuX7xcgZAP9YfMADyw2tfY7+CB1j5iy666Cra3/siqiwpOCtWZFml13Y1SQyvqy9KjGNVFtFrl/PS0hcoXWCb5deWBjlcDbTKrUM8iZklbfvJIRe/5fpFrAwLI2vxL/EzrVd6BJ29UFOgZGmIf/oV/AsvvPCo5+YJYLH0YeXx54nJSEzEY7xPkaWPR4IUog/3xheozMpDvV4waBK/GHn+8iIX4o+qzmKVV+ROLnN99NpcH3Hd1772tX/bj/sDCIIXihvEDz5T6NdLlqYM2pS2VVuvE8tWnj4wf16WHn+ePqKv6LMTS6I/LNybsPTi/MjezAJh+WGIH2tg5Q3aRnkDhW0R9Lb6/Rer4cP1Meuv7eW4P/0OABCzwHwaBFh3UpL9WndAipK2vPjiiwlezbX0tqbNzbURuaU0/HliM36Xiizd0X4/BoaMMgSz9KKJXqTfF5SlL6NJ/G4NlvpNxU0LXUyb1Hb4NEpZs+X73eIw3V6q13SKif/aa6/99V4XvlJAKAjmyj9NC2qSuVYDd7ZiB2XBq03DrSmyNnodNTeIHteGzI358yKiP8oTFkXtjWiBrBiiX/CIX1wJt2dx3MWF5ff7d5tcHxd/rPRi/bE8sdrLADDxw/Xr1/8GA2A2M0Ag3KFJnQ0QOud2v86x6hfMe0EI/pJLLrnK2492hAjeFqTEsPKxKGX+vBjFZvZsy5anIkQZwoK39CmUB8Biyhsi6KWWg2lT1p+bFIp8vxqd6TWsPxWeBL5Yf1vx1TY67vL3ve99vzGbGCAFBgJL+LfJXyYrUuesgMgJTLHonMMgQg+E4D1Ts04sB6+0ZTk3T0GhWXlmYDFuIImnGBfpSgxYyaeP/s2iTyBcHxN/FLd5Q+IrYv2xKKQ8cX24oysC37PVIVgiK3TzzsJSFdkfbelQC4LJUHi/DwUEjPx8JmL87F81hIlAY2AgWPztlJghf4d8lu9gwdkH+8KSs+9+g9JuoA3uuOMOcvEhdkhbIXhza8TI2Jgvr/a2AJa21/aNXm/FGkzU0odrg+DN0mfBd4H6gsYJhutjfr/fdEzDkvLE9bHAVzwJy6MtfuZZuD/aYv0j749PyjTNAMCKFQOAWWC2gfBcRdm60wZO8+FFE7y2JnhtcWtwJWlTUsq2Cisy4x7vaec3sCilLTFZuDZNJQgl4WfxVyAahq1Zfm/A8PvLWZ8jvM4HixNpz9PD/dEAKFKfItmfphlApLPDyq1jFfKnP/3pN+bjIEDsxDm+0mpi59rFMAStFp6FKHNrRFzJyNhYbh4r720fASwzMqLH0pf9eRO7TiELvg+E+MP1Kay/iPUvVnvd9z/ei6DILuD+0Fmk2WIAFAGwOhurhoUru0A2ABYtWnTFRz/60euxisN2h+oE5841hCvjROxcpwme69frJsGL57vLGCnKcGsiY0NbM+PaDeEEsB6LYZhC8NFvWfD9Qn0XjdZa5mDWP+p89H98fywPvn/h/ojc1M6qL9mfCIAtA6QOp5OLNQAXAAPAZgGo11jFdRdeeOGvfPnLX/5DLObOnTv7Wh2uE5wb5/jFL37xDzlnzt8ZgxrabKfrQuyRiy8sPIIXETw/xkDbnSrR05bMqEXGRgxfHsEvJYAN10acU7cKTjzcTzTrTyPT2Ii/VN9fHgB0EgtfuD/FDFAeAHodawBR/4MYmPJjEJhYSgPhCohvjBX9zne+85+fffbZ72JZcSUa8hs9OBYixy2j/h33BaEzSHV+bWLX+yZ2kQEe/jvXfCFtoC1tQVo4XBpqbMyP1wx6YgSv8YAnvS67NRHAWr0NfcRW/8+iHxZoUG9U+9nRDr4/7g8ZBnzQGAAEwEzX4QJFzT9TugXC2lIGYYNAW5sJxBCNzQZiDAQTmG8ZEBYoI0IyRrgYWF8GxvPPP/+jqampv5uenv77TgOEv/EZxRg/5zsIGz788MNfeOCBB/4d+2ZNguNx3DgH0c7H/4/YOc9w4cJ3N+uu9yxg1XXj+mHdCVpjAQqXprDwBK748Qie4JW2ZYaNWhsRwS8uB666jCz4ESIsyiIvZ7UBIJr7oy0WyRa+yP54EHasLNcJHgMwAAjUzlDHkwWyWaA8CFwgFhCLCKd1NrBBAPV3tiG6EKMNhtgSN7T+P8h72of9Lf7PZ+L90ud4D5aPx/HjfIqsjIjQzbLrPWY1Brb9yoi2zHi4Mwx+s+4IXq9XY+G1xVjQZpatcWOy3Ns2nn5Q9uWjP7Loa4A1dNn9Ect3dzEVxwCwGSAGgEgMwCqjLYKJMQtYLCDaTCAyCBBNZIViNsBdsIGgrc0I2kawaGIUEWIhVN73v5Xfs9cV7xdbfx37LAeliDzcF4RuYtdrfHZmLwtUxUhHhtix7mfIyluWRoyg1QQfi1AInhQy7emzqll5Nzbmyzsz6oZPrTYAStb/4Fj4wv/3APj1DACvH4kgmM4+kaldtFmAKV9kGd4WxMRiEOg1MYGtDbi4GAhYVROd3otZIRiDoti2vhbDUsffTNhseT/+pq0JXNtC5NqGr87sVLbq5saIWPbIv3NNJnaulWt2647/Tlusom3cSBAvFYGrGG6N1c5ra1aets+uzfhRngHoHPM/xUh/FgNApHOj/ucoX4SxQSAyCPBzmQnIamAdGQS4QwwExISo7KG3UK8jPojBEAMiGG4H2xBuzBpl2vuifU9/j63NNiL7N+q1iVw0iy6xw8JnFwuxaxuuDDMcM90J4b/7QiDGYKUnCEzwZQsvlgVvondmTBBaB0BUfMYAwIot90FgbpDPAuVYgPUABIILYFkhLKX4JrFwibRlNkBoxawg4lbY7OAsBkaZIWJt43X5b2zje1jwELhZco6lrVlzveY8IIMzhI4Lg9DDjeFaYpWVHLxZd23Df1/hxWRh4Ze0+PEwi33SEe4PZADEIPAsEAMgHm5FR8csQJpupfu3NhOIxzAICIr1OmICxISoGAg2I/hgsAEhEiPYoHCGu4FYCyJeFzBksMDyZ+J7kJkmrPhZOh45do5X9tWZoSwjw6B1N4ZZDDfGFpz82pjpuNaw7iF4LHxZ7IV1z+7MHEN5AMByHOAWzQaBSMeXXaHUTIB4bDbQ9kSfEXCLmgYDlBAJlsNNgjEojC5cXoeI7XXp71huG0zaImz2xT7LAueYzEZh0RE6AxSfnXO1rIxoqUhtD3VXhmssr7QeXFp8imKysuCz6Oc4yh1pM4CTDl/s7lDMAljB5QiltC6ApbSBIBIcHy3X4ZhSfHCCzwwMCsTIgGBgIE5IQBkDBOJ3I2ITctA/E5+N75oV19YsuR+HY3LssOicU/jrZtX93AuxO82V8es1sYuRFi4MRLby8xPFIIhZADILtMwERUwgriitDsMYCOEaITybGTRDIEQEiTCPk1AhQsVtim2Il6295m8tnzuOgVXyzY+JgBS3xWekyMRwToXQw2eP3LvINRVidwvf6spksS8gFANA22JBLFaFxdZBYLOBu0WFayRajIAIRQZF68AwehZllbYMFLbx//h78VrkuyZuMfa50ssGQuSw8NU9djEXxjMz4bebZU+4MhkLFK0Wz/7vA6DJHXLaQHBRlQeDDQgxBoTRZwlEGoMjXBB77e+3/u3Q2JYGGFzOglJY87hDzcUeFj3O08Tu1xFiN8GLGRmvocUCFu6QaKIJt0ivmwZDKecd1pZtkIERg6M8SJroN9mEa1JsxaVhxf04wRB4iDzOK7JYrTd/xLXFNiMjCRNLiL+8RVAuKnMdWgZDMEQZVjgssmVRytvW1yU27QP3K7IvoomcbQhdbD3f1sGckTFrmLDKRFwusBCgCbKCZeEWbHGtWv9f3m+wSeQh8NhmZIwaIbSy8FpfG1v/LzYJGfKZYPm98t/8fRDbjIzJhAsWhHjtdcvWUPp7xsjwutf9f5vOtQpmDKqXAAAAAElFTkSuQmCC"></div> \
                      <div class="kore-chat-header forUNL"> \
                          <div class="lefti"></div>\
                          <div id="botHeaderTitle" aria-labelledby="botHeaderTitle" class="header-title" title="${chatTitle}">${chatTitle}</div> \
                          <div class="chat-box-controls"> \
                              {{if botMessages.availableLanguages}}\
                                  <select class="lang-selector" >\
                                      {{each(key, lang) botMessages.availableLanguages}} \
                                          <option  {{if botMessages.selectedLanguage===lang}}selected{{/if}} value="${lang}">${lang}</option>\
                                      {{/each}}\
                                  </select>\
                              {{/if}}\
                              <button class="reload-btn" style="display:none;" title="${botMessages.reconnectText}"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTNweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTMgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5yZWxvYWQ8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNTcuMDAwMDAwLCAtMjQxLjAwMDAwMCkiIGZpbGw9IiM4QTk1OUYiIHN0cm9rZT0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJyZWxvYWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM1OC4wMDAwMDAsIDI0Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC44LDUuMjczNTc2NTggQzEwLjgsMi4zNjU3MTQyIDguMzc3NTg1NzEsMCA1LjQwMDAyMzg3LDAgQzIuNDIyNDYyMDMsMCAwLDIuMzY1NzE0MiAwLDUuMjczNTc2NTggQzAsNS40NDYzMTE0MiAwLjE0MzQwNjM1Myw1LjU4NjM1OTc2IDAuMzIwMjgyOTQyLDUuNTg2MzU5NzYgQzAuNDk3MTU5NTMsNS41ODYzNTk3NiAwLjY0MDU2NTg4Myw1LjQ0NjI4ODEgMC42NDA1NjU4ODMsNS4yNzM1NzY1OCBDMC42NDA1NjU4ODMsMi43MTA2NDc2NSAyLjc3NTY0MjI2LDAuNjI1NTg5NjY4IDUuNCwwLjYyNTU4OTY2OCBDOC4wMjQzNTc3NCwwLjYyNTU4OTY2OCAxMC4xNTk0MzQxLDIuNzEwNjcwOTYgMTAuMTU5NDM0MSw1LjI3MzU3NjU4IEMxMC4xNTk0MzQxLDcuODM2NDU4ODkgOC4wMjQzNTc3NCw5LjkyMTU0MDE4IDUuNCw5LjkyMTU0MDE4IEw0Ljg0NDMyNzI0LDkuOTIxNTQwMTggTDUuNjM4ODc1MzEsOS4wNTI5NzAwMyBDNS43NTY3MzczMyw4LjkyNDE1OTEyIDUuNzQ1MzAyMDYsOC43MjY0MDgxNiA1LjYxMzQwMjYsOC42MTEzMDYgQzUuNDgxNTAzMTMsOC40OTYyMDM4NSA1LjI3ODk4NjcyLDguNTA3Mzk0NjYgNS4xNjExNDg1Nyw4LjYzNjIwNTU2IEw0LjAyNTM1Njg4LDkuODc3ODAyNzYgQzMuODM5NDMyMzUsMTAuMDgxMDU1OSAzLjgzOTQzMjM1LDEwLjM4NzU5MDggNC4wMjUzNTY4OCwxMC41OTA4NDQgTDUuMTYxMTQ4NTcsMTEuODMyNDQxMiBDNS4yMjQ0MzY0NCwxMS45MDE2Mzc3IDUuMzEyMDc0OTgsMTEuOTM2ODQyMSA1LjQwMDExOTM3LDExLjkzNjg0MjEgQzUuNDc2MDYwMDQsMTEuOTM2ODQyMSA1LjU1MjMxMTA2LDExLjkxMDU5MDMgNS42MTM0MDI2LDExLjg1NzM0MDcgQzUuNzQ1MzI1OTQsMTEuNzQyMjM4NiA1Ljc1NjczNzMzLDExLjU0NDQ4NzYgNS42Mzg4NzUzMSwxMS40MTU2NzY3IEw0Ljg0NDMyNzI0LDEwLjU0NzEwNjUgTDUuNCwxMC41NDcxMDY1IEM4LjM3NzU4NTcxLDEwLjU0NzEwNjUgMTAuOCw4LjE4MTM5MjM0IDEwLjgsNS4yNzM1NzY1OCBaIiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="></button> \
                              <button class="minimize-btn" title="${botMessages.minimizeText}"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIycHgiIHZpZXdCb3g9IjAgMCAxNCAyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1Mi4zICg2NzI5NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+bWluaW1pemU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjYuMDAwMDAwLCAtMjMzLjAwMDAwMCkiIGZpbGw9IiM4QTk1OUYiPgogICAgICAgICAgICA8ZyBpZD0ibWluaW1pemUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyNi4wMDAwMDAsIDIzMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBwb2ludHM9IjAgMCAxMy45Mzk5OTk2IDAgMTMuOTM5OTk5NiAxLjk5OTk5OTk0IDAgMS45OTk5OTk5NCI+PC9wb2x5Z29uPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="></button> \
                              <button class="expand-btn" style="display:none;" title="${botMessages.expandText}"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5leHBhbmQ8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMDUuMDAwMDAwLCAtMjUyLjAwMDAwMCkiIGZpbGw9IiM4QTk1OUYiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSJleHBhbmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwNS4wMDAwMDAsIDI1Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xLjg2NjY2NjY3LDkuMzMzMzMzMzMgTDAsOS4zMzMzMzMzMyBMMCwxNCBMNC42NjY2NjY2NywxNCBMNC42NjY2NjY2NywxMi4xMzMzMzMzIEwxLjg2NjY2NjY3LDEyLjEzMzMzMzMgTDEuODY2NjY2NjcsOS4zMzMzMzMzMyBaIE0wLDQuNjY2NjY2NjcgTDEuODY2NjY2NjcsNC42NjY2NjY2NyBMMS44NjY2NjY2NywxLjg2NjY2NjY3IEw0LjY2NjY2NjY3LDEuODY2NjY2NjcgTDQuNjY2NjY2NjcsMCBMMCwwIEwwLDQuNjY2NjY2NjcgWiBNMTIuMTMzMzMzMywxMi4xMzMzMzMzIEw5LjMzMzMzMzMzLDEyLjEzMzMzMzMgTDkuMzMzMzMzMzMsMTQgTDE0LDE0IEwxNCw5LjMzMzMzMzMzIEwxMi4xMzMzMzMzLDkuMzMzMzMzMzMgTDEyLjEzMzMzMzMsMTIuMTMzMzMzMyBaIE05LjMzMzMzMzMzLDAgTDkuMzMzMzMzMzMsMS44NjY2NjY2NyBMMTIuMTMzMzMzMywxLjg2NjY2NjY3IEwxMi4xMzMzMzMzLDQuNjY2NjY2NjcgTDE0LDQuNjY2NjY2NjcgTDE0LDAgTDkuMzMzMzMzMzMsMCBaIiBpZD0iU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button>\
                              <button class="close-btn" title="Clicking on close will end the Chatbot session"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5jbG9zZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM0NC4wMDAwMDAsIC0yMjkuMDAwMDAwKSIgZmlsbD0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJjbG9zZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ0LjAwMDAwMCwgMjI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjE0IDEuNCAxMi42IDAgNyA1LjYgMS40IDAgMCAxLjQgNS42IDcgMCAxMi42IDEuNCAxNCA3IDguNCAxMi42IDE0IDE0IDEyLjYgOC40IDciPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button> \
                          </div> \
                      </div> \
                      <div class="kore-chat-header historyLoadingDiv"> \
                          <div class="historyWarningTextDiv displayTable"> \
                              <span><img class = "loadingHistory" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAAXNSR0IArs4c6QAAAYZJREFUOBGtVLFKA0EQfbMiiERQEgjpRQt/wULB/opIFCuJvb1iKdprbbASDaa4L9DCX7BQ7CVwQcEggph13t7t3RlivMKBsDsz701mZ9+eYNjaNyX0e9saDmCxZJv1mrQ6zxDcayxEqXyOxmo/TzN5B2fXDbxFT7D2VH9rgK3FeV3pM848cTnLirQ6e0q60lw1lx+11bziHD5Oi1tcZVfAkyIYOYRM3GF69gHvr4uwX8sY2AMFVDwIkA3srLcFnAFb9B2I3GJqchNbQTcDJ7uLsIqPz0s91koS6WKmMm+SIfojRL8WIIuF+QdAlBSpks+ZBEkA7gijOkgBumGeR80sMLzG1OcMilgep3wDseWUxyEWsTnzmMKUr51ILw3wForYy2AhhSlfO3FKjGO8xiKWxymfgw1THnXAaxxnzMd68ajQuLcAeE1UnA5+K+R1kgmuS/4/KdY3xbdgB0fe/XMVs49m/Zi4uBPPiN/Qibrj5qJHl12+GU/7WYTRoe+J0xFlMOZ78g1n4achujvX7QAAAABJRU5ErkJggg=="></span> \
                              <p class="headerTip warningTip">${botMessages.loadinghistory}</p> \
                          </div> \
                      </div> \
                      <div class="kore-chat-header trainWarningDiv"> \
                          <div class="trainWarningTextDiv displayTable"> \
                              <span class="exclamation-circle"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span> \
                              <p class="headerTip warningTip">Something went wrong.Please try again later.</p> \
                          </div> \
                      </div> \
                      <div role="log" aria-live="polite" aria-atomic="true" class="kore-chat-body"> \
                          <div class="errorMsgBlock"> \
                          </div> \
                          <ul class="chat-container"></ul> \
                      </div> \
                      <div class="typingIndicatorContent"><div style="background-image:url(../UI/libs/images/UNL_Profile_Icon.png)"></div><div class="movingDots"></div></div> \
                      <div class="kore-chat-footer disableFooter">' +
              chatFooterTemplate +
              '{{if isSendButton}}<div class="sendBtnCnt"><button class="sendButton disabled" type="button"><img style="height: 48px;" src="data:image/png;base64,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"></img></button></div>{{/if}}</div> \
                      <div id="myModal" class="modalImagePreview">\
                           <span class="closeImagePreview">&times;</span>\
                           <div class="image-preview">\
                              <img class="modal-content-imagePreview" id="img01">\
                           </div>\
                           <div id="caption"></div>\
                      </div>\
                      <div id="chatBodyModal" class="chatBodyModal animate-bottom">\
                      <span class="closeChatBodyModal" aira-label="Close Form" role="button" tabindex="0" aria-atomic="true"></span>\
                      <div id="closeInlineModel" class="loading_form iframeLoader"></div>\
                      <div id="chatBodyModalContent"></div>\
                      </div>\
                      <div id="myPreviewModal" class="modalImagePreview">\
                            <span class="closeElePreview">&times;</span>\
                            <div class="largePreviewContent"></div>\
                      </div>\
                      <div class="kr-wiz-content-chat defaultTheme-kore">\
                      </div>\
                  </div> \
              </script>';
          } else {
            chatWindowTemplate =
              '<script id="chat_window_tmpl" type="text/x-jqury-tmpl"> \
                  <div class="kore-chat-window droppable liteTheme-one"> \
                  <div class="kr-wiz-menu-chat defaultTheme-kore">\
                  </div>	\
                      <div class="minimized-title"></div> \
                      <div><img class="minimized" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAAC+CAYAAACLdLWdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAACnvSURBVHhe7Z0LsFzVlZ4NQkhCMgiweGPxNDaYh8GAAQlRsRM7MJWBSXkelbFHPDKuxC57UjWpytQwhrEH51GegEMgwS4/Eso2AVwzU8YPEbvGIzx24sFgmUFBZrCDQBlTPKQrCV0kYd/83+q1Dqe79+nH7e7Tfe/df9Wv0+rbfR57/3vttdZe5/TrMoaDmZmZk8QrxPXizb/85S8/7/xL8WfO7fpbEvzNP/OoyHf+TLxNf7pZZJ/s+yQ/XEZGvZD4ViJCifL3RISNUCsFPWxwLDEGxu/pLQbESj+9jIzhAFGJV0tkt4mP6vVEgnPjHPXyajEPhIz+IeFg0W8S/xJRzUX4ueMmneeXlZHRDgkEsWPVa3Nb6oKuidjh83p5hV9uxkKGhLBSgsCyzzuxV8EHwU16mQPlhQZ1OtZ9qG7M1PTMzOZtMzP3/2Bm5nMbZ2Y+9hczM79/z8zMb/2XmZmr/uPMzNpbGjz599M8948af+ezfOcDX2jsg309+Fhj3xxjmPA2WO/NkjEfoQ4emnV/5qWGGBEmAu0k6GEzBsZtGxrnwLkMCrXJz7QhZZpngfkCdebAgkdcWHIseJ0i75VrP9E4t/v/ZrCBwAAQb9XLPADmKnbs2HH4IIL/X3/XsOiTKPRuZFbg3LmG2SIPgDkGddbhv/jFL1g57VvwIXb87ZSg5iJjNpjNIFAbWiDsTZsxoThAfbVeov+/jW7rDQSMtz3YsJIp4cwnMghm4w4xALTJQfCkQZ1ynjqnrywNFvB3Pz+/rHs/nM0soDZm5Rr354BGy2eMBfjxsvAs0/cMOpusSEoMC5G0BbNAP8CV1CaLfxxQw5OLZwruCVnwnRluUK/wtmclOA+AOqDG7svKZ8H3x34HANZf3ZLFPyqojQleT1JD/8havAse35YFPwh/9wu9B8Fu/XPqcxRQ41L/3jVFSZaGlGSqMzP7J23ZywCgb+gjvczWfwjAyrPyymJKVzz4tws3SzNK9uP+4IZ6vxkb3ZjRM2i06enpkyX6rjd/YJGyWzN6kgLt0fqXXZ8s/l6gBqOhDti7d+/bZD26LkZlK18ve7X+JfFn4feIA9RovyN29OezLz9e0vZTe7wzKkAf7t+//xr6tNG1GW1QO5mlV2MRIHUE0y2WJ9UhmfWRPujF9fGUZ0Yr1DYmehqo0VTVuE/TbHZtJof0RS+uj4s/W/4SwtJzO1xH3Loh3fiZ4yeFft1QEv/CHgBqC0t5dbP0+PNkFFINnjk5pI+6+f3y+f9YXX+guKDFfyAN4W2SBD7kVbemGzpz8kh5dze/Pyy/Xi448R9w0003HdjN0ucgdm6yl6AXg4cGEIP+uyAGgPl4vVj6LPq5y17E/+qrr/4rbRaE5Q/RX2NXXoEs+vnBXsS/d+/ea6UJ8/n133k5AEz0zz333KmdFqey6OcXu4kfLezevfv8cHvmIw5E9PLrK8sQsujnJ3sQ/8927NhxynwUP9Z+URb9wmU38UsbP9q8efOR0sm8EL+5NyJpy0/5NbaBPH1OWc5/kurslOdHI2jFOWcRwcqBHr1XIi9OLRzS152AVtCMXprR9O2cgom+WzCbyxAWHjuVN6AV/H30o//OOdG/zgOVjn49xU2phsmc/6TYsApz1d+3VVnYaZGKQCdXWS5c0vedgl38fTee4fZMNvwkD5yenv4HdgUJEMzmDE4mGugU7KIhaWkRehInVvycmIlePKiTi5PvnMoMooUqkN8vuTyhr4mDnVg3Fyf79Zmt5AcuqlB2eUxlE4Yidfncc8+d1jjlduRFqswUu/n7O3bsuEDaWqSXk2XxOSEflbg4lU86y/n6zCryeJgqSFPfQVsi/v5kiF/nZS6OSEB7feNU25FdnMxu7OTy7N279zpprAh09dZYB0CInhNaXBXQZhcnsxfi8lRleQh0H3744TeU/P2xC5+TWKQR+TE/xzbkLE5mr+yU5VGg+zFpDZfH1on01tjEb9b+mWeeOb2TtU9dYGZmFXnSdQqUMzzyyCOr3vve94bLUzsQvIlePOiVV1653c+tDfzcTuriMjOr2CnQlWfx8XXr1o010D2QE3jqqafe5OfUhhzQZs6WVb/PhdXfuHHjKunPXB5TYo0wv15c3Mna54A2c7bsZvWlvYNdg/VYfR2XAxXWvsq3z9Y+c1B2svobNmw4SjoMX78W8ZvwxcW7d+++wc+lDdnaZw7KXqy+B7qjFb6OV1h7bZdMqrU/58ZGWmzDY52XwjPSIKtC27HSvuaWdBvXxU5WHw2KB3luf6TiZ+fm2+/cufOf+zm04TfvTF/EqInguaOr2/MbM/rDfT8Y3wDoZPWfe+65fyQtmq+v/6LN0Yjfp5WDzjzzzIP379+/sXH4ZnxfIzR1AaMmgy0LfnR45sXxpaarrP6rr776V6tXr16KJt3qjwQHIPwLLrhg8aZNm87wY7dhHIVonVb7MoaLcfQvPz1ahXvvvfcYaTN8/aGLP1ycRaeddtqSl19+WRNfO8axSosVyqgXdVv+TjU809PTfyJdLvG4c+hlDCZ8rL22SyclqMXvZArOqBeI8Jya75euejKDtLjjhBNOWCZdLg6rr7eHIn52whRyENZ+27Zt724csh11pzAJujLGA9o+1SejIg+jqgKalD4tw+NaHRiIPoS/mJG1b9++u/14Tag7qMXaZ4wXdVv9qiB3z549d0ify/BIcHkGDnS1TxO+TyGkjQ6pcnPqDnpyQDt+fOzP030zKlb1Oe7OscceewjZRmn0IL0VBhvOGubmkDbavHnzJY1DtaNuN6dq9GfUh7pneYLcKmzduvU90ulSj0PR7Ozv0mLKCGuPm1OVzRlH7j7n7McPEgupvhklqwzerl27PuFB7sDFa+HiWHmCuHzv3r0P+XGaUPeUBzMmA6m+GSWr3B20iUZJwJStvtg3+JK5OeKyT3/60yf4MdpAxJ06yVEyYzKQ6ptRcm2HpAYaRatiWfh9i58vRFC7bNu2bb/l+2/CuG4tzJgMpPpm1KwqPESj0uohaNYXtGYlfLP2TB2rVq1aQcrI99+EcVViZkwGUn0zaqK5FHbv3n0nWpVui6pNvd278PkwX8JX8iKg1+/fv//HtvcWjOshURmTgVTfjJpoLgU0ilbRrPv5EeT2LP5y7n7ZHXfccaLvuw3juuEkYzKQ6ptRs5Of/8lPfvJEadbcHREN47n0jAhq+fLyLVu2XOX7bcI4Hx2SMRlI9U0drPLz0erRRx+9XLotCtfEnsC0EGlMc3Neeumlf+P7bQKPfEudVB3MmAyk+qYOcodYCi+88MIfHHnkka9Huy1pza7uDh/gw3wJ4R86PT39Nd9vE24b4+9XZUwGUn1TB6vy+Qpwv4RmRVvMcpe9q/DjA+bfU/+g7WFVC1fjusUQZkwGUn1TB6tuTtm3b99jRxxxBMIPP7/7Pbn6Hn/kQxHYkho6nCKgxm6bMY6Fq2DGZCDVN3WwKsBFq2iWtCap+J5uUPE/lt2cFffee+95tscWUCuTOqG6OGxQA8L0SYPGMRjYpM6qAqnZYNTHqes6AnGMcbCqXusrX/nKudKu+fmu5Y4WP6rZIrDFRzp006ZN/6Sxu2bwCIrUydTFYYEfokMoqWOUyWcGKYwb9XHquo5WpI5RF6seLotmCXDjzizXNNpOit8WrTwY4MOHHH744Ydt3br1Q76/JowzowOHAcRy1a3p/aeI5ZytKEd5nLquI4XU/uti1QoumpV+D0PDIqu4aLrS3eHNEL5VY4orX3rppX/f2F0zPrsxfTJ1cRjoxUK2ku/0i1Efp67rSCG177r4ueQDbiyl+R8OO+ywleTz8fOl48jnJ4Vv9fceDCzxRYDDt2/ffpfvrwnjKEUuc1AMsvjWz00woz5OXddRhdR+62LV4N25c+eXJfzDcXcoXyjdjlht8cVi4Uo8Ys+ePV/3/TVh3M+9HxSD1Bj1Yy1HfZy6rqMKqf3WRa49hampqXvQrmu4pwDXCtO0NeELR05PT/+1768J48zhw0GBn5vaby/sVCvSilEfp67rqEJqv3Wx6vGCr7zyyl+jXc/nl+vz26HPMxri2TnLCGy1fYN28reN3TVjkAYfBgdFap/9sFekvtsPuyH1nX44KFL7rItXSoMp7N+/fyvaFSPAtYK1KnfHAlu/U91WbMWjtJNnfH9NKOeJx8FBkdpnP+wVqe/2w25IfacfDorUPuti1Yzlwl/lxnu5a7rywbIHeGB7cAS24lGvvvrqVGN3zaj7mSqtHBSDDNwqS5PCqI9T13VUIbXfulglfDSLdglwtbVKTbHyxhSmgXIqky8d3dhVO1InUicHxSBZqaqgKoVRH6eu66hCar91sgrLly8/2jVM2Y1ldrRt9/P1WUZCBLYrGC2HHHLIMY3dtCN1EnVyUAzySJR+ntc56uPUdR1VSO23TlZBGj4GDfutiGi6MpfPG5HKXHHooYceMZ+FD2ZjLWeTAhz1ceq6jhRS+66TVZCGj0HD2nZNafKmWXwv5D9i2bJlx/l+2pA6iTo5DLBsj5+b2n+KfHZWJQsjPk5d15FCav91sgrS77FipDQL4etPTcLnP003l/tomdfCBwigF4uJhRxELKM+Tl3X0YrUMepkFeStIHyz+FGs1pbO1OdM+CJpn2WMEhYA9HreCz+Av0uwd+WfvnYMsgYIBT96WBj1ceq6jkAcY1ysAtoV0fCh3FCFUS/djVWA//Bm3HXF9MACwPGkhnxfTRgkjTYMZkwGUn1TF6seIotm0a6I8GMRC1fHqjTFQvxNjxMRC+HP1wWsjOEg1Td1EQ2msG/fvmekXSy+rd7GUxdEs/j6yAHh5oTFZ1TEqu0bFNxWCn+ulyxkDAepvqmLBOkpTE9PPy798hxNhF/cf+vGvdLih/BXicfv3r37+76/Jsz1IrWM4SDVN3Wxqkhtz54935d2Eb75+KXHh7fl8pPCl8U/4cUXX7zf99cEAqjUydTFjMlAqm/qYtWTFqamph6Ufo9fsWJF1OuYxRfN1RELFMKPR4qIWPxK4c9m0WSYzJgMpPqmLpKpSuHnP//55zDaEn5ThWarq8M/MGXxj3/66ac/5ftrwny49TBjcKT6pi5W3Xq4devW26RfsjpNPr7Y7OqQ2G+1+D5ajt+0adO/9v014f6af+6xlRmTgVTf1MWqxwiiWYy2a9iEH6XJYrOrI4bFtwUsbU343/jGN5I/CDFfHi+SMRhSfVMXqx4vsmHDht9Eu65htLysRfgm/vLzdOxH3rQ14TNqPv7xj1/e2F0zWPZOnUxdzJgMpPqmLlaVXqBZtOvVB2VX5zXh63P2wusYCovv0wSLAKfs379/Z2OXzRjnIlbGZCDVN3WwKofPqu2SJUtO8VqdEH6kMxF+aL7t0YF8iOpMvmTCf/nll/+P7bUF43zSwigeh5fRH8Y561fl8Hft2vW/pdmTS0VqIfwoWWhDCN+qM8UjNV0cp9Fz8vPPP/8V328TxpnSHMYzYTIGwyA3wQxKHlGfwvbt2/+ntHuyaML3EnsTvns1r0GfD1fHhO93rTBajpHwT9q8eXOyKmKcjxGsyuFm1IdxGr6qjM4TTzzxJ9LtarTrGm69EeU16PMNh7+R57RfOdSWO7AYNSd99atf/WeN3TaDEtjUSdXBTj/vnlEPxvX7Z7DqtskHHnjgt6XZN4p2zy1ajh+D059D5w3whlt8+3lPbbnndqW2fPmNV1999QW21wTGGeBWPTQ0Y/QY18+8wjUVVZngmmuuOX/p0qX8ABzaRcPFUxZENN4sfG1M+CLRLx8uhC+eXhXgjrNmB6s/zLuJMnoDiYVxWns0lwIaRauKTU9Yvnz5Ua7hpseLaNsG3rRcvtcvs3pLvQ6j57StW7f+d99/E8a9gltVqJQxOoz7uan3SXMpPPvss/9NWj0V4WtrBWpUIrgXE09Sa4a+h9VH+Itb7sJiJ6d+61vfSj4nf5x+frDKAmQMHyQVUn1QJ6v8ezS6ZMmSU6XXWLyKArUlXpITi7VNMOH70m6ULfBlln5PufLKKy9u7L4d474bC2L5c25/dODHJ8idp9q+TlYtXAE0ilbF4n5bcRmBLdYe6mPNwvc3zOKL5D3J7PBlMjsnH3zwwW+emppKTjLjLlEO4nfmgHe4QPC3PdiIp1JtXjer0tg7d+78gXR6hkgqM1ZtW1OZbdbe4D5QLGLZ09S0JR+6WsI/48knn7zDj9OEcS5kpMgAwP1hnWFzRSFTRjWYOWk7RDYpgg9WLVyiTen0TaKlMl278RS1eMJCO/TdIqUptmV2JPzT77333vWNw7Rj3A+RXWjECg8Lqf1PIjulMe+8885/Kp2eJhKTktFB+Obfi50tvsAfQvj242+e2bEAVzyzqmBtUtydhcRhiT+170lkVRLjlVde2SbD/BY0SlWma5bAFuNtd165UW8Xvr5fLk82P9/rHKjZsQAXP//pp5++247WgklzdxYKhyH+1H4nkVVuzrZt2/5C+kT4FtiWMjpFVWYysC2BP4S7Y8VqvhMrXRDPuOeee65tHK4d5ad3ZdbHQeqWxn1fRa/s5ObIBb+WGJS6MrRaelhsuSoTbfckfCtdEFfyrPGlS5fi5xM8nFXl7ty6IX3SmaPnbNcyJmEdphdWLVrh5kiTbyUG1bao0RFxczDeaLmjtQ+Uf+uW4IAAN1Zw8fPPeuKJJ5LV0FiPHOSOj7MR/1wRftWi1ZYtW+6UJs+MhSuxWLHV646lCq1gZBS/hdW6kEUQ8Z73vGeNH7cN417OXuhkIa+f+qW5IPxOA/ojH/nIP5Yu34w2xaaFKxENm8UXOyL8oAhwi2fl8yMR2pqfv3jx4nO2b9+eXCrKQe74yeMdexX/XBB+VVA7NTX1N9Lj2SIueLIGP0oVxJ5gfr4X9yxnMcB/UwgfilzpWXffffcNfvw2jPvxgpm9i3/ShV91iyF46KGH/kgeyJlo0kuR+cE3+yl/vTY3R0T4PSOsPlNF8Zu3ork7Iqmjc6uC3Gz1J4OIv1v90qQLv0tQey6uN5r0lLvl792/tzSm2LO1j9KFyO7gK8UvpBxLykgHoybi7M2bN/9XP482ZKs/GaR8o5P4x/18pE7slMLcuHHjR9GgGGnM8m9eWWGauzk9ZXQKIH7/iUR8JaYOc3c8rUnq6Kx3v/vda7PVn3x2Ev8k91Mna//hD3/4SsWaZ0mH4ebYHVdxq6Fe9xTUtoIRYu4O2R2mDnd3mEqK7I625z7++ON3+fm0IVv9yWGV+CdV+J2s/ZNPPvklif5c6S9Wa8tlCoWb02sasxV8iakiqjWtfMFvQLdqTW3Pfte73rUuW/25wZT4J7WPqqw9+NCHPnSVhG/ZHFn71fEMHTKQ8Sz8Wbk5wL9gfn5kd0RbxdW2yO6I52WrP3fYKv5JFD5rQVV46qmnvoTmcHPk21s1pmvSsjnh5iB8fbw/0Qf4ItMF7k48U7P8aEGRhYNzFAtcUWX1Jzl4Wqgsi38ShV+1Sjs9Pf3/PvjBD/4KmpPH8WYJ/+Rly5aVi9LCzcG/n53oHfaDEaUgt3jQlBhB7lvFtz322GOf9vNrQy5ZnjwifozSpAm/U8EdGkNr4lmuPRatojanbdFKX5m1+OPLCJ+RhLtjQa7fyU59hAW573znO69gRNoZtiDX8Ewmubtq3D/wUSYBbSdrL529vRzUugYJaotFK4z0bIPaJuiYCD+CXMvpi+VSZZaL36oTOv/b3/72HzdOsx088i11sZmZwU4BLdqSzrD2VGKWSxSsNsd9+8VDE75QviWRIBd3B6vP7V1Rscmy8bkHHXTQ21988cUf+rm2IQe6mVXsVIi2a9euLdLWhWhMfAuVmL5SayUK2mLtLagV0epA/n0BHZsdsUMrYYg7s0gjkU7Sa1Kb+Prn33LLLb/dON12MI1llyezlZ1cHPCBD3zgV9EWGsPaewqzXJDWWok5HOELIfzi2ZriShYNwtfXCYXVv/AnP/lJ5fjNLk9mKzu5OD/+8Y8/I129HW2JWHtbsBJjwcp8e3HoogcmfI+W7Ulr1OmTRvLFgyZff82aNe+qCnRBzvJkBjtlcTygvUiaepuIRxG+vS1YieW6e1uwEocufBM/wYMHEragJR7ltRIsJliGB1//rrvu+pd+/m0gy8P0lmqIzIVDNNCpdPozn/nMv5CeytaeeNIeH4Jv74+zb7L2+tpQhQ9M+GLxmEHR7s5iEUEnVbb6b+vm8mR/f2HznBs7+/W4OB7QWibHtWWZHF+wsvIE1+Ks63J6RYg/MjyF1RcZibaaK+Gfo+3bcXl27tz5E7+WNtw3xmesZ46Xnfx6d3HeIV7gWopbC8O3j5vJzdq76Idu6ZvgBzGrz4gjwxOPICHa9hU1angYqRcpIr9m3759u/ya2pCfzLDw2OlZQGjlhhtuuEbawdqfR9LENfXGRCYnHh0yeuELHMSsPhkeVsxaSpbtAbPaMlJJQV30ve997za/riTI4aYaKHP+sduTINCKNMNTj9GO3Wgi8mNu1IfZExS0XY72vJSmFtEDDgLN6hPoel6f6ccqN32EFulNbd+xZcuW/+HX1gYCHB7/nGqozPlD+rhTMItG0IqIi4O1J1nCjSbl5+W8PlZpRRO+vlqf8D21ab5++YckCHS1LQJdkZF74eWXX/4PO/n7BDo50zN/2W2Ras+ePX8vI3mJtHKRWAS0njQ5zquCsfbF83LE2qx9oPU5m5xIPHXtKBa1fKHBXB6N3gt0URdff/31v8YFNi61HVn885O9iB5toBG0Is2cjbvsGor0JdYejRUVmMSb+nqtwg9YyTIuT8nqF2XLIrl9c3lE8rHvuPnmm3+nU7CbxT+/2E30aOG6667jEd/m4rhW7JEhIhqygBZ32jVWXyanCn5wC3TFpfGjcWLK5TlPvJDp7Jvf/KaaoxpZ/POD3UQP7rnnnj+QLnBxWnP2TS4O2vJymXImZzzQeZu/Ly7icQ7a2oquT0utuX0idEY0Ptwl3/3udz/VuPQ0svjnNnsR/aOPPvpZaeFS1wSxoN1ZpW3h4oisE+Hi2CNDtEX0obvxWHwhDm5WP1wez/LEYwfN5fEInRQn4idddekjjzzyOW+DJLL45yb7FD1aQBNoA41QlkAJTOTscZ/LtxSOza9vAifhJ2L+vk9H5u/Hwpa4WoEK4j9Tlt/8fbk8+HSX0QA0RBVowJzqnDukr3oU/WUiGrC7qtCGXttClXgs2iFnH3dWiYh+vC5OBcLfZ2QupYCIQiJ8NK/lYRGiXMtjwa54WTfLT+43L3JNPumjTnl6QF+r7y8j1lPf2+qs9MBKf+HXi3Y7oYjoI2cfoh+/tS+jJdA18Yv4Zk3+vkZ23LRCIGOLW2JXyw9yecPkspefJHLRrymJnnJjUpexOotGioWqeEaOr9CGbz9x4KSKhS2vmluG5fdnGh7t+X1uWiGAMcuvLQ1wCVagm+UHFDflqs7JIVWWFBt2A32rfl5DX3uf0/dRkhDBbPH8S2JF15D59U7TmDiR4ARN/GLh74tRyBbBLuLnwq2eR+xZ/DnonQz2EsQCMnjq33BvuLEkMjitwazdOC5Gvr5YqNLriUdh+X3EWoqzdMdWZHqKeh7xfDUK0T0Ncxm53U6LXABfMt/JNT5y51Q3f54+/PrXv/4J9am5NyKiLzI4JDy0tWBWPNJ/fcf8+khdajeRPJlYS19GnChWv8jvl56zb5kejfjTRRO/N8hFbhXWrF+//r2dyhsCuD7Z+tdHXBvum+4G+u7GG2+8Tn1J9gbR496YpRfLxWfHkgBxbURJAgZzMoPZHsAJm9tDitMr6qyeR7THEFK/r21YfsvxYxW0paHWvP/97//1XsTPdJuzPqMnj4fpxbWZmpp6kr5TP5roRVugknEri56+L5caF3U4Yvj1c070IKx+Eey6+K2E2YvZrKwBy68tOX4K2gqfXyQYWrt58+b7vE07Ilv/0bBXKw/oq8suu4wfZAvRY+nNvXGf/nRE7w8piLTlisjgiOUMzpwUPmgTf2ll18SvLTevFOIX8fljddcCXnHtQw899J+6+f0Ai5R9/+GxF18e0DcbN268XX12uRjZGwtkw9LTx2VLX7phPNwbE/1cCWY7Qm3SJn4f3W3iF09XI7GYYaXM2mL5Lc8v9uz6AAZA/unR2RO35vFnvTG7oOTarMVF9T4z90ZMujfUc7nom3L1iF67nLOWvowQPmQk48ORqoonstkCFzl+bRG/lTJL+KQ6mxa5RHN9fvjDH3Z4gnozsvvTHxE8T1DuFbg2l1566ZXeN9Te0FflQJa09WlL/Of2RSs8Q/St7o12FzqZVwjhm+UXzfKXFrhoEKxBBLxvaRW/uz3m+tx+++0f6dX6gzwAOrNfwdP29IH6Jaw8hilEH4tThaUPn77k3iD6Ilev7byx9ClETjZ+WM4sv4jlL7I9IuK3RS6JnxXe89S4FLYVuX7xcgZAP9YfMADyw2tfY7+CB1j5iy666Cra3/siqiwpOCtWZFml13Y1SQyvqy9KjGNVFtFrl/PS0hcoXWCb5deWBjlcDbTKrUM8iZklbfvJIRe/5fpFrAwLI2vxL/EzrVd6BJ29UFOgZGmIf/oV/AsvvPCo5+YJYLH0YeXx54nJSEzEY7xPkaWPR4IUog/3xheozMpDvV4waBK/GHn+8iIX4o+qzmKVV+ROLnN99NpcH3Hd1772tX/bj/sDCIIXihvEDz5T6NdLlqYM2pS2VVuvE8tWnj4wf16WHn+ePqKv6LMTS6I/LNybsPTi/MjezAJh+WGIH2tg5Q3aRnkDhW0R9Lb6/Rer4cP1Meuv7eW4P/0OABCzwHwaBFh3UpL9WndAipK2vPjiiwlezbX0tqbNzbURuaU0/HliM36Xiizd0X4/BoaMMgSz9KKJXqTfF5SlL6NJ/G4NlvpNxU0LXUyb1Hb4NEpZs+X73eIw3V6q13SKif/aa6/99V4XvlJAKAjmyj9NC2qSuVYDd7ZiB2XBq03DrSmyNnodNTeIHteGzI358yKiP8oTFkXtjWiBrBiiX/CIX1wJt2dx3MWF5ff7d5tcHxd/rPRi/bE8sdrLADDxw/Xr1/8GA2A2M0Ag3KFJnQ0QOud2v86x6hfMe0EI/pJLLrnK2492hAjeFqTEsPKxKGX+vBjFZvZsy5anIkQZwoK39CmUB8Biyhsi6KWWg2lT1p+bFIp8vxqd6TWsPxWeBL5Yf1vx1TY67vL3ve99vzGbGCAFBgJL+LfJXyYrUuesgMgJTLHonMMgQg+E4D1Ts04sB6+0ZTk3T0GhWXlmYDFuIImnGBfpSgxYyaeP/s2iTyBcHxN/FLd5Q+IrYv2xKKQ8cX24oysC37PVIVgiK3TzzsJSFdkfbelQC4LJUHi/DwUEjPx8JmL87F81hIlAY2AgWPztlJghf4d8lu9gwdkH+8KSs+9+g9JuoA3uuOMOcvEhdkhbIXhza8TI2Jgvr/a2AJa21/aNXm/FGkzU0odrg+DN0mfBd4H6gsYJhutjfr/fdEzDkvLE9bHAVzwJy6MtfuZZuD/aYv0j749PyjTNAMCKFQOAWWC2gfBcRdm60wZO8+FFE7y2JnhtcWtwJWlTUsq2Cisy4x7vaec3sCilLTFZuDZNJQgl4WfxVyAahq1Zfm/A8PvLWZ8jvM4HixNpz9PD/dEAKFKfItmfphlApLPDyq1jFfKnP/3pN+bjIEDsxDm+0mpi59rFMAStFp6FKHNrRFzJyNhYbh4r720fASwzMqLH0pf9eRO7TiELvg+E+MP1Kay/iPUvVnvd9z/ei6DILuD+0Fmk2WIAFAGwOhurhoUru0A2ABYtWnTFRz/60euxisN2h+oE5841hCvjROxcpwme69frJsGL57vLGCnKcGsiY0NbM+PaDeEEsB6LYZhC8NFvWfD9Qn0XjdZa5mDWP+p89H98fywPvn/h/ojc1M6qL9mfCIAtA6QOp5OLNQAXAAPAZgGo11jFdRdeeOGvfPnLX/5DLObOnTv7Wh2uE5wb5/jFL37xDzlnzt8ZgxrabKfrQuyRiy8sPIIXETw/xkDbnSrR05bMqEXGRgxfHsEvJYAN10acU7cKTjzcTzTrTyPT2Ii/VN9fHgB0EgtfuD/FDFAeAHodawBR/4MYmPJjEJhYSgPhCohvjBX9zne+85+fffbZ72JZcSUa8hs9OBYixy2j/h33BaEzSHV+bWLX+yZ2kQEe/jvXfCFtoC1tQVo4XBpqbMyP1wx6YgSv8YAnvS67NRHAWr0NfcRW/8+iHxZoUG9U+9nRDr4/7g8ZBnzQGAAEwEzX4QJFzT9TugXC2lIGYYNAW5sJxBCNzQZiDAQTmG8ZEBYoI0IyRrgYWF8GxvPPP/+jqampv5uenv77TgOEv/EZxRg/5zsIGz788MNfeOCBB/4d+2ZNguNx3DgH0c7H/4/YOc9w4cJ3N+uu9yxg1XXj+mHdCVpjAQqXprDwBK748Qie4JW2ZYaNWhsRwS8uB666jCz4ESIsyiIvZ7UBIJr7oy0WyRa+yP54EHasLNcJHgMwAAjUzlDHkwWyWaA8CFwgFhCLCKd1NrBBAPV3tiG6EKMNhtgSN7T+P8h72of9Lf7PZ+L90ud4D5aPx/HjfIqsjIjQzbLrPWY1Brb9yoi2zHi4Mwx+s+4IXq9XY+G1xVjQZpatcWOy3Ns2nn5Q9uWjP7Loa4A1dNn9Ect3dzEVxwCwGSAGgEgMwCqjLYKJMQtYLCDaTCAyCBBNZIViNsBdsIGgrc0I2kawaGIUEWIhVN73v5Xfs9cV7xdbfx37LAeliDzcF4RuYtdrfHZmLwtUxUhHhtix7mfIyluWRoyg1QQfi1AInhQy7emzqll5Nzbmyzsz6oZPrTYAStb/4Fj4wv/3APj1DACvH4kgmM4+kaldtFmAKV9kGd4WxMRiEOg1MYGtDbi4GAhYVROd3otZIRiDoti2vhbDUsffTNhseT/+pq0JXNtC5NqGr87sVLbq5saIWPbIv3NNJnaulWt2647/Tlusom3cSBAvFYGrGG6N1c5ra1aets+uzfhRngHoHPM/xUh/FgNApHOj/ucoX4SxQSAyCPBzmQnIamAdGQS4QwwExISo7KG3UK8jPojBEAMiGG4H2xBuzBpl2vuifU9/j63NNiL7N+q1iVw0iy6xw8JnFwuxaxuuDDMcM90J4b/7QiDGYKUnCEzwZQsvlgVvondmTBBaB0BUfMYAwIot90FgbpDPAuVYgPUABIILYFkhLKX4JrFwibRlNkBoxawg4lbY7OAsBkaZIWJt43X5b2zje1jwELhZco6lrVlzveY8IIMzhI4Lg9DDjeFaYpWVHLxZd23Df1/hxWRh4Ze0+PEwi33SEe4PZADEIPAsEAMgHm5FR8csQJpupfu3NhOIxzAICIr1OmICxISoGAg2I/hgsAEhEiPYoHCGu4FYCyJeFzBksMDyZ+J7kJkmrPhZOh45do5X9tWZoSwjw6B1N4ZZDDfGFpz82pjpuNaw7iF4LHxZ7IV1z+7MHEN5AMByHOAWzQaBSMeXXaHUTIB4bDbQ9kSfEXCLmgYDlBAJlsNNgjEojC5cXoeI7XXp71huG0zaImz2xT7LAueYzEZh0RE6AxSfnXO1rIxoqUhtD3VXhmssr7QeXFp8imKysuCz6Oc4yh1pM4CTDl/s7lDMAljB5QiltC6ApbSBIBIcHy3X4ZhSfHCCzwwMCsTIgGBgIE5IQBkDBOJ3I2ITctA/E5+N75oV19YsuR+HY3LssOicU/jrZtX93AuxO82V8es1sYuRFi4MRLby8xPFIIhZADILtMwERUwgriitDsMYCOEaITybGTRDIEQEiTCPk1AhQsVtim2Il6295m8tnzuOgVXyzY+JgBS3xWekyMRwToXQw2eP3LvINRVidwvf6spksS8gFANA22JBLFaFxdZBYLOBu0WFayRajIAIRQZF68AwehZllbYMFLbx//h78VrkuyZuMfa50ssGQuSw8NU9djEXxjMz4bebZU+4MhkLFK0Wz/7vA6DJHXLaQHBRlQeDDQgxBoTRZwlEGoMjXBB77e+3/u3Q2JYGGFzOglJY87hDzcUeFj3O08Tu1xFiN8GLGRmvocUCFu6QaKIJt0ivmwZDKecd1pZtkIERg6M8SJroN9mEa1JsxaVhxf04wRB4iDzOK7JYrTd/xLXFNiMjCRNLiL+8RVAuKnMdWgZDMEQZVjgssmVRytvW1yU27QP3K7IvoomcbQhdbD3f1sGckTFrmLDKRFwusBCgCbKCZeEWbHGtWv9f3m+wSeQh8NhmZIwaIbSy8FpfG1v/LzYJGfKZYPm98t/8fRDbjIzJhAsWhHjtdcvWUPp7xsjwutf9f5vOtQpmDKqXAAAAAElFTkSuQmCC"></div> \
                      <div class="kore-chat-header"> \
                          <div class="lefti"></div>\
                          <div id="botHeaderTitle" aria-labelledby="botHeaderTitle" class="header-title" title="${chatTitle}">${chatTitle}</div> \
                          <div class="chat-box-controls"> \
                              {{if botMessages.availableLanguages}}\
                                  <select class="lang-selector" >\
                                      {{each(key, lang) botMessages.availableLanguages}} \
                                          <option  {{if botMessages.selectedLanguage===lang}}selected{{/if}} value="${lang}">${lang}</option>\
                                      {{/each}}\
                                  </select>\
                              {{/if}}\
                              <button class="reload-btn" style="display:none;" title="${botMessages.reconnectText}"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTNweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTMgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5yZWxvYWQ8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNTcuMDAwMDAwLCAtMjQxLjAwMDAwMCkiIGZpbGw9IiM4QTk1OUYiIHN0cm9rZT0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJyZWxvYWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM1OC4wMDAwMDAsIDI0Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC44LDUuMjczNTc2NTggQzEwLjgsMi4zNjU3MTQyIDguMzc3NTg1NzEsMCA1LjQwMDAyMzg3LDAgQzIuNDIyNDYyMDMsMCAwLDIuMzY1NzE0MiAwLDUuMjczNTc2NTggQzAsNS40NDYzMTE0MiAwLjE0MzQwNjM1Myw1LjU4NjM1OTc2IDAuMzIwMjgyOTQyLDUuNTg2MzU5NzYgQzAuNDk3MTU5NTMsNS41ODYzNTk3NiAwLjY0MDU2NTg4Myw1LjQ0NjI4ODEgMC42NDA1NjU4ODMsNS4yNzM1NzY1OCBDMC42NDA1NjU4ODMsMi43MTA2NDc2NSAyLjc3NTY0MjI2LDAuNjI1NTg5NjY4IDUuNCwwLjYyNTU4OTY2OCBDOC4wMjQzNTc3NCwwLjYyNTU4OTY2OCAxMC4xNTk0MzQxLDIuNzEwNjcwOTYgMTAuMTU5NDM0MSw1LjI3MzU3NjU4IEMxMC4xNTk0MzQxLDcuODM2NDU4ODkgOC4wMjQzNTc3NCw5LjkyMTU0MDE4IDUuNCw5LjkyMTU0MDE4IEw0Ljg0NDMyNzI0LDkuOTIxNTQwMTggTDUuNjM4ODc1MzEsOS4wNTI5NzAwMyBDNS43NTY3MzczMyw4LjkyNDE1OTEyIDUuNzQ1MzAyMDYsOC43MjY0MDgxNiA1LjYxMzQwMjYsOC42MTEzMDYgQzUuNDgxNTAzMTMsOC40OTYyMDM4NSA1LjI3ODk4NjcyLDguNTA3Mzk0NjYgNS4xNjExNDg1Nyw4LjYzNjIwNTU2IEw0LjAyNTM1Njg4LDkuODc3ODAyNzYgQzMuODM5NDMyMzUsMTAuMDgxMDU1OSAzLjgzOTQzMjM1LDEwLjM4NzU5MDggNC4wMjUzNTY4OCwxMC41OTA4NDQgTDUuMTYxMTQ4NTcsMTEuODMyNDQxMiBDNS4yMjQ0MzY0NCwxMS45MDE2Mzc3IDUuMzEyMDc0OTgsMTEuOTM2ODQyMSA1LjQwMDExOTM3LDExLjkzNjg0MjEgQzUuNDc2MDYwMDQsMTEuOTM2ODQyMSA1LjU1MjMxMTA2LDExLjkxMDU5MDMgNS42MTM0MDI2LDExLjg1NzM0MDcgQzUuNzQ1MzI1OTQsMTEuNzQyMjM4NiA1Ljc1NjczNzMzLDExLjU0NDQ4NzYgNS42Mzg4NzUzMSwxMS40MTU2NzY3IEw0Ljg0NDMyNzI0LDEwLjU0NzEwNjUgTDUuNCwxMC41NDcxMDY1IEM4LjM3NzU4NTcxLDEwLjU0NzEwNjUgMTAuOCw4LjE4MTM5MjM0IDEwLjgsNS4yNzM1NzY1OCBaIiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="></button> \
                              <button class="minimize-btn" title="${botMessages.minimizeText}"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIycHgiIHZpZXdCb3g9IjAgMCAxNCAyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1Mi4zICg2NzI5NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+bWluaW1pemU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjYuMDAwMDAwLCAtMjMzLjAwMDAwMCkiIGZpbGw9IiM4QTk1OUYiPgogICAgICAgICAgICA8ZyBpZD0ibWluaW1pemUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyNi4wMDAwMDAsIDIzMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBwb2ludHM9IjAgMCAxMy45Mzk5OTk2IDAgMTMuOTM5OTk5NiAxLjk5OTk5OTk0IDAgMS45OTk5OTk5NCI+PC9wb2x5Z29uPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="></button> \
                              <button class="expand-btn" style="display:none;" title="${botMessages.expandText}"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5leHBhbmQ8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iQXJ0Ym9hcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMDUuMDAwMDAwLCAtMjUyLjAwMDAwMCkiIGZpbGw9IiM4QTk1OUYiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSJleHBhbmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwNS4wMDAwMDAsIDI1Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xLjg2NjY2NjY3LDkuMzMzMzMzMzMgTDAsOS4zMzMzMzMzMyBMMCwxNCBMNC42NjY2NjY2NywxNCBMNC42NjY2NjY2NywxMi4xMzMzMzMzIEwxLjg2NjY2NjY3LDEyLjEzMzMzMzMgTDEuODY2NjY2NjcsOS4zMzMzMzMzMyBaIE0wLDQuNjY2NjY2NjcgTDEuODY2NjY2NjcsNC42NjY2NjY2NyBMMS44NjY2NjY2NywxLjg2NjY2NjY3IEw0LjY2NjY2NjY3LDEuODY2NjY2NjcgTDQuNjY2NjY2NjcsMCBMMCwwIEwwLDQuNjY2NjY2NjcgWiBNMTIuMTMzMzMzMywxMi4xMzMzMzMzIEw5LjMzMzMzMzMzLDEyLjEzMzMzMzMgTDkuMzMzMzMzMzMsMTQgTDE0LDE0IEwxNCw5LjMzMzMzMzMzIEwxMi4xMzMzMzMzLDkuMzMzMzMzMzMgTDEyLjEzMzMzMzMsMTIuMTMzMzMzMyBaIE05LjMzMzMzMzMzLDAgTDkuMzMzMzMzMzMsMS44NjY2NjY2NyBMMTIuMTMzMzMzMywxLjg2NjY2NjY3IEwxMi4xMzMzMzMzLDQuNjY2NjY2NjcgTDE0LDQuNjY2NjY2NjcgTDE0LDAgTDkuMzMzMzMzMzMsMCBaIiBpZD0iU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button>\
                              <button class="close-btn" title="Clicking on close will end the Chatbot session"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5jbG9zZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM0NC4wMDAwMDAsIC0yMjkuMDAwMDAwKSIgZmlsbD0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJjbG9zZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ0LjAwMDAwMCwgMjI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjE0IDEuNCAxMi42IDAgNyA1LjYgMS40IDAgMCAxLjQgNS42IDcgMCAxMi42IDEuNCAxNCA3IDguNCAxMi42IDE0IDE0IDEyLjYgOC40IDciPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button> \
                          </div> \
                      </div> \
                      <div class="kore-chat-header historyLoadingDiv"> \
                          <div class="historyWarningTextDiv displayTable"> \
                              <span><img class = "loadingHistory" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAAXNSR0IArs4c6QAAAYZJREFUOBGtVLFKA0EQfbMiiERQEgjpRQt/wULB/opIFCuJvb1iKdprbbASDaa4L9DCX7BQ7CVwQcEggph13t7t3RlivMKBsDsz701mZ9+eYNjaNyX0e9saDmCxZJv1mrQ6zxDcayxEqXyOxmo/TzN5B2fXDbxFT7D2VH9rgK3FeV3pM848cTnLirQ6e0q60lw1lx+11bziHD5Oi1tcZVfAkyIYOYRM3GF69gHvr4uwX8sY2AMFVDwIkA3srLcFnAFb9B2I3GJqchNbQTcDJ7uLsIqPz0s91koS6WKmMm+SIfojRL8WIIuF+QdAlBSpks+ZBEkA7gijOkgBumGeR80sMLzG1OcMilgep3wDseWUxyEWsTnzmMKUr51ILw3wForYy2AhhSlfO3FKjGO8xiKWxymfgw1THnXAaxxnzMd68ajQuLcAeE1UnA5+K+R1kgmuS/4/KdY3xbdgB0fe/XMVs49m/Zi4uBPPiN/Qibrj5qJHl12+GU/7WYTRoe+J0xFlMOZ78g1n4achujvX7QAAAABJRU5ErkJggg=="></span> \
                              <p class="headerTip warningTip">${botMessages.loadinghistory}</p> \
                          </div> \
                      </div> \
                      <div class="kore-chat-header trainWarningDiv"> \
                          <div class="trainWarningTextDiv displayTable"> \
                              <span class="exclamation-circle"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span> \
                              <p class="headerTip warningTip">Something went wrong.Please try again later.</p> \
                          </div> \
                      </div> \
                      <div role="log" aria-live="polite" aria-atomic="true" class="kore-chat-body"> \
                          <div class="errorMsgBlock"> \
                          </div> \
                          <ul class="chat-container"></ul> \
                      </div> \
                      <div class="typingIndicatorContent"><div style="background-image:url(../UI/libs/images/Bot_Response_Icon.png)"></div><div class="movingDots"></div></div> \
                      <div class="kore-chat-footer disableFooter">' +
              chatFooterTemplate +
              '{{if isSendButton}}<div class="sendBtnCnt"><button class="sendButton disabled" type="button"><img style="height: 48px;" src="data:image/png;base64,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"></img></button></div>{{/if}}</div> \
                      <div id="myModal" class="modalImagePreview">\
                           <span class="closeImagePreview">&times;</span>\
                           <div class="image-preview">\
                              <img class="modal-content-imagePreview" id="img01">\
                           </div>\
                           <div id="caption"></div>\
                      </div>\
                      <div id="chatBodyModal" class="chatBodyModal animate-bottom">\
                      <span class="closeChatBodyModal" aira-label="Close Form" role="button" tabindex="0" aria-atomic="true"></span>\
                      <div id="closeInlineModel" class="loading_form iframeLoader"></div>\
                      <div id="chatBodyModalContent"></div>\
                      </div>\
                      <div id="myPreviewModal" class="modalImagePreview">\
                            <span class="closeElePreview">&times;</span>\
                            <div class="largePreviewContent"></div>\
                      </div>\
                      <div class="kr-wiz-content-chat defaultTheme-kore">\
                      </div>\
                  </div> \
              </script>';
          }
  
          var msgTemplate;
          var hostnameGTLOrUNL = new URLSearchParams(window.location.search).get("botHost");
          hostnameGTLOrUNL="GTL";
          
          if (hostnameGTLOrUNL == "GTL") {
            msgTemplate =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                      {{if msgData.message}} \
                          {{each(key, msgItem) msgData.message}} \
                              {{if msgItem.cInfo && msgItem.type === "text"}} \
                                  <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                                       class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} {{if msgData.icon}}with-icon{{/if}} {{if msgData.fromAgent}}from-agent{{/if}}"> \
                                      {{if msgData.createdOn}}<div aria-hidden="true" aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                                      {{if msgData.icon}}<div aria-hidden="true"  aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(/bot-avatar.png)" title="User Avatar"></div> </div> {{/if}} \
                                      <div class="messageBubble ForGTL" aria-live="assertive">\
                                          <div> \
                                              {{if msgData.type === "bot_response"}} \
                                                  {{if msgItem.component  && msgItem.component.type =="error"}} \
                                                      <span style="color:${msgItem.component.payload.color}">{{html helpers.convertMDtoHTML(msgItem.component.payload.text, "bot",msgItem)}} </span>\
                                                      {{else}} \
                                                      {{if msgItem.component && msgItem.component.type == "message" && msgItem.component.payload.fileUrl}} \
                                                       <div class="msgCmpt botResponseAttachments" fileid="${msgItem.component.payload.fileUrl}"> \
                                                          <div class="uploadedFileIcon"> \
                                                            {{if extension[extension.length-1]=="xlsx" || extension[extension.length-1]=="xls" || extension[extension.length-1]=="docx" || extension[extension.length-1]=="doc" || extension[extension.length-1]=="pdf" || extension[extension.length-1]=="ppsx" || extension[extension.length-1]=="pptx" || extension[extension.length-1]=="ppt" || extension[extension.length-1]=="zip" || extension[extension.length-1]=="rar"}}\
                                                               <span class="icon cf-icon icon-files_${extension[extension.length-1]}"></span> \
                                                            {{else extension[extension.length-1]}}\
                                                               <span class="icon cf-icon icon-files_other_doc"></span> \
                                                            {{/if}}\
                                                          </div> \
                                                          <div class="botuploadedFileName">${extractedFileName}</div> \
                                                      </div> \
                                                      {{else}} \
                                                      <span class="simpleMsg" {{if msgData}}msgData="${JSON.stringify(msgData)}" {{/if}}>{{html helpers.convertMDtoHTML(msgItem.cInfo.body, "bot",msgItem)}}</span> \
                                                      {{/if}} \
                                                      {{if msgItem.component && msgItem.component.payload && msgItem.component.payload.videoUrl}}\
                                                          <div class="videoEle"><video width="300" controls><source src="${msgItem.component.payload.videoUrl}" type="video/mp4"></video></div>\
                                                      {{/if}}\
                                                      {{if msgItem.component && msgItem.component.payload && msgItem.component.payload.audioUrl}}\
                                                          <div class="audioEle"><audio width="180" controls><source src="${msgItem.component.payload.audioUrl}"></audio></div>\
                                                      {{/if}}\
                                                  {{/if}} \
                                              {{else}} \
                                                  {{if msgItem.cInfo.renderMsg && msgItem.cInfo.renderMsg !== ""}}\
                                                      {{html helpers.convertMDtoHTML(msgItem.cInfo.renderMsg, "user",msgItem)}} \
                                                  {{else}}\
                                                      {{html helpers.convertMDtoHTML(msgItem.cInfo.body, "user",msgItem)}} \
                                                  {{/if}}\
                                              {{/if}} \
                                          </div>\
                                          {{if msgItem.cInfo && msgItem.cInfo.emoji}} \
                                              <span class="emojione emojione-${msgItem.cInfo.emoji[0].code}">${msgItem.cInfo.emoji[0].title}</span> \
                                          {{/if}} \
                                          {{if msgItem.cInfo.attachments}} \
                                              <div class="msgCmpt attachments" fileid="${msgItem.cInfo.attachments[0].fileId}"> \
                                                  <div class="uploadedFileIcon"> \
                                                      {{if msgItem.cInfo.attachments[0].fileType == "image"}} \
                                                          <span class="icon cf-icon icon-photos_active"></span> \
                                                      {{else msgItem.cInfo.attachments[0].fileType == "audio"}}\
                                                          <span class="icon cf-icon icon-files_audio"></span> \
                                                      {{else msgItem.cInfo.attachments[0].fileType == "video"}} \
                                                          <span class="icon cf-icon icon-video_active"></span> \
                                                      {{else}} \
                                                          {{if extension[1]=="xlsx" || extension[1]=="xls" || extension[1]=="docx" || extension[1]=="doc" || extension[1]=="pdf" || extension[1]=="ppsx" || extension[1]=="pptx" || extension[1]=="ppt" || extension[1]=="zip" || extension[1]=="rar"}}\
                                                              <span class="icon cf-icon icon-files_${extension[1]}"></span> \
                                                          {{else extension[1]}}\
                                                              <span class="icon cf-icon icon-files_other_doc"></span> \
                                                          {{/if}}\
                                                      {{/if}}\
                                                  </div> \
                                                  <div class="curUseruploadedFileName">${msgItem.cInfo.attachments[0].fileName}</div> \
                                              </div> \
                                          {{/if}} \
                                          {{if msgData.isError}} \
                                              <div class="errorMsg">Send Failed. Please resend.</div> \
                                          {{/if}} \
                                      </div> \
                                  </li> \
                              {{/if}} \
                          {{/each}} \
                      {{/if}} \
                  </scipt>';
          } else if (hostnameGTLOrUNL == "UNL") {
            msgTemplate =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                      {{if msgData.message}} \
                          {{each(key, msgItem) msgData.message}} \
                              {{if msgItem.cInfo && msgItem.type === "text"}} \
                                  <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                                       class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} {{if msgData.icon}}with-icon{{/if}} {{if msgData.fromAgent}}from-agent{{/if}}"> \
                                      {{if msgData.createdOn}}<div aria-hidden="true" aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                                      {{if msgData.icon}}<div aria-hidden="true"  aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(../UI/libs/images/UNL_Profile_Icon.png)" title="User Avatar"></div> </div> {{/if}} \
                                      <div class="messageBubble ForUNL" aria-live="assertive">\
                                          <div> \
                                              {{if msgData.type === "bot_response"}} \
                                                  {{if msgItem.component  && msgItem.component.type =="error"}} \
                                                      <span style="color:${msgItem.component.payload.color}">{{html helpers.convertMDtoHTML(msgItem.component.payload.text, "bot",msgItem)}} </span>\
                                                      {{else}} \
                                                      {{if msgItem.component && msgItem.component.type == "message" && msgItem.component.payload.fileUrl}} \
                                                       <div class="msgCmpt botResponseAttachments" fileid="${msgItem.component.payload.fileUrl}"> \
                                                          <div class="uploadedFileIcon"> \
                                                            {{if extension[extension.length-1]=="xlsx" || extension[extension.length-1]=="xls" || extension[extension.length-1]=="docx" || extension[extension.length-1]=="doc" || extension[extension.length-1]=="pdf" || extension[extension.length-1]=="ppsx" || extension[extension.length-1]=="pptx" || extension[extension.length-1]=="ppt" || extension[extension.length-1]=="zip" || extension[extension.length-1]=="rar"}}\
                                                               <span class="icon cf-icon icon-files_${extension[extension.length-1]}"></span> \
                                                            {{else extension[extension.length-1]}}\
                                                               <span class="icon cf-icon icon-files_other_doc"></span> \
                                                            {{/if}}\
                                                          </div> \
                                                          <div class="botuploadedFileName">${extractedFileName}</div> \
                                                      </div> \
                                                      {{else}} \
                                                      <span class="simpleMsg" {{if msgData}}msgData="${JSON.stringify(msgData)}" {{/if}}>{{html helpers.convertMDtoHTML(msgItem.cInfo.body, "bot",msgItem)}}</span> \
                                                      {{/if}} \
                                                      {{if msgItem.component && msgItem.component.payload && msgItem.component.payload.videoUrl}}\
                                                          <div class="videoEle"><video width="300" controls><source src="${msgItem.component.payload.videoUrl}" type="video/mp4"></video></div>\
                                                      {{/if}}\
                                                      {{if msgItem.component && msgItem.component.payload && msgItem.component.payload.audioUrl}}\
                                                          <div class="audioEle"><audio width="180" controls><source src="${msgItem.component.payload.audioUrl}"></audio></div>\
                                                      {{/if}}\
                                                  {{/if}} \
                                              {{else}} \
                                                  {{if msgItem.cInfo.renderMsg && msgItem.cInfo.renderMsg !== ""}}\
                                                      {{html helpers.convertMDtoHTML(msgItem.cInfo.renderMsg, "user",msgItem)}} \
                                                  {{else}}\
                                                      {{html helpers.convertMDtoHTML(msgItem.cInfo.body, "user",msgItem)}} \
                                                  {{/if}}\
                                              {{/if}} \
                                          </div>\
                                          {{if msgItem.cInfo && msgItem.cInfo.emoji}} \
                                              <span class="emojione emojione-${msgItem.cInfo.emoji[0].code}">${msgItem.cInfo.emoji[0].title}</span> \
                                          {{/if}} \
                                          {{if msgItem.cInfo.attachments}} \
                                              <div class="msgCmpt attachments" fileid="${msgItem.cInfo.attachments[0].fileId}"> \
                                                  <div class="uploadedFileIcon"> \
                                                      {{if msgItem.cInfo.attachments[0].fileType == "image"}} \
                                                          <span class="icon cf-icon icon-photos_active"></span> \
                                                      {{else msgItem.cInfo.attachments[0].fileType == "audio"}}\
                                                          <span class="icon cf-icon icon-files_audio"></span> \
                                                      {{else msgItem.cInfo.attachments[0].fileType == "video"}} \
                                                          <span class="icon cf-icon icon-video_active"></span> \
                                                      {{else}} \
                                                          {{if extension[1]=="xlsx" || extension[1]=="xls" || extension[1]=="docx" || extension[1]=="doc" || extension[1]=="pdf" || extension[1]=="ppsx" || extension[1]=="pptx" || extension[1]=="ppt" || extension[1]=="zip" || extension[1]=="rar"}}\
                                                              <span class="icon cf-icon icon-files_${extension[1]}"></span> \
                                                          {{else extension[1]}}\
                                                              <span class="icon cf-icon icon-files_other_doc"></span> \
                                                          {{/if}}\
                                                      {{/if}}\
                                                  </div> \
                                                  <div class="curUseruploadedFileName">${msgItem.cInfo.attachments[0].fileName}</div> \
                                              </div> \
                                          {{/if}} \
                                          {{if msgData.isError}} \
                                              <div class="errorMsg">Send Failed. Please resend.</div> \
                                          {{/if}} \
                                      </div> \
                                  </li> \
                              {{/if}} \
                          {{/each}} \
                      {{/if}} \
                  </scipt>';
          } else {
            msgTemplate =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                      {{if msgData.message}} \
                          {{each(key, msgItem) msgData.message}} \
                              {{if msgItem.cInfo && msgItem.type === "text"}} \
                                  <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                                       class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} {{if msgData.icon}}with-icon{{/if}} {{if msgData.fromAgent}}from-agent{{/if}}"> \
                                      {{if msgData.createdOn}}<div aria-hidden="true" aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                                      {{if msgData.icon}}<div aria-hidden="true"  aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(../UI/libs/images/Bot_Response_Icon.png)" title="User Avatar"></div> </div> {{/if}} \
                                      <div class="messageBubble" aria-live="assertive">\
                                          <div> \
                                              {{if msgData.type === "bot_response"}} \
                                                  {{if msgItem.component  && msgItem.component.type =="error"}} \
                                                      <span style="color:${msgItem.component.payload.color}">{{html helpers.convertMDtoHTML(msgItem.component.payload.text, "bot",msgItem)}} </span>\
                                                      {{else}} \
                                                      {{if msgItem.component && msgItem.component.type == "message" && msgItem.component.payload.fileUrl}} \
                                                       <div class="msgCmpt botResponseAttachments" fileid="${msgItem.component.payload.fileUrl}"> \
                                                          <div class="uploadedFileIcon"> \
                                                            {{if extension[extension.length-1]=="xlsx" || extension[extension.length-1]=="xls" || extension[extension.length-1]=="docx" || extension[extension.length-1]=="doc" || extension[extension.length-1]=="pdf" || extension[extension.length-1]=="ppsx" || extension[extension.length-1]=="pptx" || extension[extension.length-1]=="ppt" || extension[extension.length-1]=="zip" || extension[extension.length-1]=="rar"}}\
                                                               <span class="icon cf-icon icon-files_${extension[extension.length-1]}"></span> \
                                                            {{else extension[extension.length-1]}}\
                                                               <span class="icon cf-icon icon-files_other_doc"></span> \
                                                            {{/if}}\
                                                          </div> \
                                                          <div class="botuploadedFileName">${extractedFileName}</div> \
                                                      </div> \
                                                      {{else}} \
                                                      <span class="simpleMsg" {{if msgData}}msgData="${JSON.stringify(msgData)}" {{/if}}>{{html helpers.convertMDtoHTML(msgItem.cInfo.body, "bot",msgItem)}}</span> \
                                                      {{/if}} \
                                                      {{if msgItem.component && msgItem.component.payload && msgItem.component.payload.videoUrl}}\
                                                          <div class="videoEle"><video width="300" controls><source src="${msgItem.component.payload.videoUrl}" type="video/mp4"></video></div>\
                                                      {{/if}}\
                                                      {{if msgItem.component && msgItem.component.payload && msgItem.component.payload.audioUrl}}\
                                                          <div class="audioEle"><audio width="180" controls><source src="${msgItem.component.payload.audioUrl}"></audio></div>\
                                                      {{/if}}\
                                                  {{/if}} \
                                              {{else}} \
                                                  {{if msgItem.cInfo.renderMsg && msgItem.cInfo.renderMsg !== ""}}\
                                                      {{html helpers.convertMDtoHTML(msgItem.cInfo.renderMsg, "user",msgItem)}} \
                                                  {{else}}\
                                                      {{html helpers.convertMDtoHTML(msgItem.cInfo.body, "user",msgItem)}} \
                                                  {{/if}}\
                                              {{/if}} \
                                          </div>\
                                          {{if msgItem.cInfo && msgItem.cInfo.emoji}} \
                                              <span class="emojione emojione-${msgItem.cInfo.emoji[0].code}">${msgItem.cInfo.emoji[0].title}</span> \
                                          {{/if}} \
                                          {{if msgItem.cInfo.attachments}} \
                                              <div class="msgCmpt attachments" fileid="${msgItem.cInfo.attachments[0].fileId}"> \
                                                  <div class="uploadedFileIcon"> \
                                                      {{if msgItem.cInfo.attachments[0].fileType == "image"}} \
                                                          <span class="icon cf-icon icon-photos_active"></span> \
                                                      {{else msgItem.cInfo.attachments[0].fileType == "audio"}}\
                                                          <span class="icon cf-icon icon-files_audio"></span> \
                                                      {{else msgItem.cInfo.attachments[0].fileType == "video"}} \
                                                          <span class="icon cf-icon icon-video_active"></span> \
                                                      {{else}} \
                                                          {{if extension[1]=="xlsx" || extension[1]=="xls" || extension[1]=="docx" || extension[1]=="doc" || extension[1]=="pdf" || extension[1]=="ppsx" || extension[1]=="pptx" || extension[1]=="ppt" || extension[1]=="zip" || extension[1]=="rar"}}\
                                                              <span class="icon cf-icon icon-files_${extension[1]}"></span> \
                                                          {{else extension[1]}}\
                                                              <span class="icon cf-icon icon-files_other_doc"></span> \
                                                          {{/if}}\
                                                      {{/if}}\
                                                  </div> \
                                                  <div class="curUseruploadedFileName">${msgItem.cInfo.attachments[0].fileName}</div> \
                                              </div> \
                                          {{/if}} \
                                          {{if msgData.isError}} \
                                              <div class="errorMsg">Send Failed. Please resend.</div> \
                                          {{/if}} \
                                      </div> \
                                  </li> \
                              {{/if}} \
                          {{/each}} \
                      {{/if}} \
                  </scipt>';
          }
          var templateAttachment =
            '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      {{each(key, msgItem) msgData.message}} \
                          {{if msgItem.component && msgItem.component.payload.url}} \
                              <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                                  class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} {{if msgData.icon}}with-icon{{/if}}"> \
                                  {{if msgData.createdOn}}<div class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                                  {{if msgData.icon}}<div class="profile-photo"> <div class="user-account avtar" style="background-image:url(/bot-avatar.png)"></div> </div> {{/if}} \
                                  {{if (${hostnameGTLOrUNL}==="GTL")}}\
                                  <div class="messageBubble"> \
                                  {{/if}}\
                                  {{if (${hostnameGTLOrUNL}==="UNL")}}\
                                  <div class="messageBubble ForUNL"> \
                                  {{/if}}\
                                  {{if (${hostnameGTLOrUNL}!=="UNL") && (${hostnameGTLOrUNL}==="GTL")}}\
                                  <div class="messageBubble"> \
                                  {{/if}}\
                                      {{if msgItem.component.payload.url}} \
                                          <div class="msgCmpt botResponseAttachments"  download="${msgItem.component.payload.download}" fileid="${msgItem.component.payload.url}"> \
                                              <div class="uploadedFileIcon"> \
                                                  {{if msgItem.component.type == "image"}} \
                                                  <img class="image-size" src="${msgItem.component.payload.url}"> \
                                                  {{else msgItem.component.type == "audio"}}\
                                                      <span class="icon cf-icon icon-files_audio"></span> \
                                                  {{else msgItem.component.type == "video"}} \
                                                      <span class="icon cf-icon icon-video_active"></span> \
                                                  {{else}} \
                                                      {{if extension[1]=="xlsx" || extension[1]=="xls" || extension[1]=="docx" || extension[1]=="doc" || extension[1]=="pdf" || extension[1]=="ppsx" || extension[1]=="pptx" || extension[1]=="ppt" || extension[1]=="zip" || extension[1]=="rar"}}\
                                                          <span class="icon cf-icon icon-files_${extension[1]}"></span> \
                                                      {{else extension[1]}}\
                                                          <span class="icon cf-icon icon-files_other_doc"></span> \
                                                      {{/if}}\
                                                  {{/if}}\
                                              </div> \
                                              <div class="botuploadedFileName">${extractedFileName}</div> \
                                          </div> \
                                      {{/if}} \
                                  </div> \
                              </li> \
                          {{/if}} \
                      {{/each}} \
                  {{/if}} \
              </scipt>';
          var popupTemplate =
            '<script id="kore_popup_tmpl" type="text/x-jquery-tmpl"> \
                      <div class="kore-auth-layover">\
                          <div class="kore-auth-popup"> \
                              <div class="popup_controls"><span class="close-popup" title="Close">&times;</span></div> \
                              <iframe id="authIframe" src="${link_url}"></iframe> \
                          </div> \
                      </div>\
              </script>';
          var buttonTemplate;
          if (hostnameGTLOrUNL == "GTL") {
            buttonTemplate =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} {{if msgData.icon}}with-icon{{/if}}"> \
                          <div class="buttonTmplContent"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info timeButton" style="margin-left: 36px;">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(/bot-avatar.png)"></div> </div> {{/if}} \
                              <ul class="buttonTmplContentBox">\
                                  <li class="buttonTmplContentHeading" id="${msgData.message[0].component.payload.text}"> \
                                      {{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                      {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                          <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                      {{/if}} \
                                  </li>\
                                  {{each(key, msgItem) msgData.message[0].component.payload.buttons}} \
                                      <a>\
                                          <li {{if msgData}}msgData="${JSON.stringify(msgData)}"{{/if}} {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} {{if msgItem.payload}}actual-value="${msgItem.payload}"{{/if}} {{if msgItem.url}}url="${msgItem.url}"{{/if}} class="buttonTmplContentChild" data-value="${msgItem.value}" type="${msgItem.type}">\
                                              ${msgItem.title}\
                                          </li> \
                                      </a> \
                                  {{/each}} \
                              </ul>\
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          } else if (hostnameGTLOrUNL == "UNL") {
            buttonTemplate =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} {{if msgData.icon}}with-icon{{/if}}"> \
                          <div class="buttonTmplContent"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(../UI/libs/images/UNL_Profile_Icon.png)"></div> </div> {{/if}} \
                              <ul class="buttonTmplContentBox forUNL">\
                                  <li class="buttonTmplContentHeading forUNL" id="${msgData.message[0].component.payload.text}"> \
                                      {{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                      {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                          <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                      {{/if}} \
                                  </li>\
                                  {{each(key, msgItem) msgData.message[0].component.payload.buttons}} \
                                      <a>\
                                          <li {{if msgData}}msgData="${JSON.stringify(msgData)}"{{/if}} {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} {{if msgItem.payload}}actual-value="${msgItem.payload}"{{/if}} {{if msgItem.url}}url="${msgItem.url}"{{/if}} class="buttonTmplContentChild" data-value="${msgItem.value}" type="${msgItem.type}">\
                                              ${msgItem.title}\
                                          </li> \
                                      </a> \
                                  {{/each}} \
                              </ul>\
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          } else {
            buttonTemplate =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} {{if msgData.icon}}with-icon{{/if}}"> \
                          <div class="buttonTmplContent"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info timeButton" style="margin-left: 36px;">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(../UI/libs/images/Bot_Response_Icon.png)"></div> </div> {{/if}} \
                              <ul class="buttonTmplContentBox">\
                                  <li class="buttonTmplContentHeading" id="${msgData.message[0].component.payload.text}"> \
                                      {{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                      {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                          <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                      {{/if}} \
                                  </li>\
                                  {{each(key, msgItem) msgData.message[0].component.payload.buttons}} \
                                      <a>\
                                          <li {{if msgData}}msgData="${JSON.stringify(msgData)}"{{/if}} {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} {{if msgItem.payload}}actual-value="${msgItem.payload}"{{/if}} {{if msgItem.url}}url="${msgItem.url}"{{/if}} class="buttonTmplContentChild" data-value="${msgItem.value}" type="${msgItem.type}">\
                                              ${msgItem.title}\
                                          </li> \
                                      </a> \
                                  {{/each}} \
                              </ul>\
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          }
  
          //Added By sushil for ()
  
          var buttonTemplate_forRedirect;
          if (hostnameGTLOrUNL == "GTL") {
            buttonTemplate_forRedirect =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} {{if msgData.icon}}with-icon{{/if}}"> \
                          <div class="buttonTmplContent"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info timeButton" style="margin-left: 36px;">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(/bot-avatar.png)"></div> </div> {{/if}} \
                              <ul class="buttonTmplContentBox">\
                                  <li class="buttonTmplContentHeading" id="${msgData.message[0].component.payload.text}"> \
                                      {{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                      {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                          <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                      {{/if}} \
                                  </li>\
                                  {{each(key, msgItem) msgData.message[0].component.payload.buttons}} \
                                      <a>\
                                          <li {{if msgData}}msgData="${JSON.stringify(msgData)}"{{/if}} {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} {{if msgItem.payload}}actual-value="${msgItem.payload}" id="${msgItem.payload}" onClick="openLink(`${msgItem.payload}`)" {{/if}} {{if msgItem.url}}url="${msgItem.url}"{{/if}} class="buttonTmplContentChild" data-value="${msgItem.value}" type="${msgItem.type}">\
                                              ${msgItem.title}\
                                          </li> \
                                      </a> \
                                  {{/each}} \
                              </ul>\
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          } else if (hostnameGTLOrUNL == "UNL") {
            buttonTemplate_forRedirect =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} {{if msgData.icon}}with-icon{{/if}}"> \
                          <div class="buttonTmplContent"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(../UI/libs/images/UNL_Profile_Icon.png)"></div> </div> {{/if}} \
                              <ul class="buttonTmplContentBox forUNL">\
                                  <li class="buttonTmplContentHeading forUNL" id="${msgData.message[0].component.payload.text}"> \
                                      {{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                      {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                          <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                      {{/if}} \
                                  </li>\
                                  {{each(key, msgItem) msgData.message[0].component.payload.buttons}} \
                                      <a>\
                                          <li {{if msgData}}msgData="${JSON.stringify(msgData)}"{{/if}} {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} {{if msgItem.payload}}actual-value="${msgItem.payload}" id="${msgItem.payload}" onClick="openLink(`${msgItem.payload}`)" {{/if}} {{if msgItem.url}}url="${msgItem.url}"{{/if}} class="buttonTmplContentChild" data-value="${msgItem.value}" type="${msgItem.type}">\
                                              ${msgItem.title}\
                                          </li> \
                                      </a> \
                                  {{/each}} \
                              </ul>\
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          } else {
            buttonTemplate_forRedirect =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} {{if msgData.icon}}with-icon{{/if}}"> \
                          <div class="buttonTmplContent"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info timeButton" style="margin-left: 36px;">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(../UI/libs/images/Bot_Response_Icon.png)"></div> </div> {{/if}} \
                              <ul class="buttonTmplContentBox">\
                                  <li class="buttonTmplContentHeading" id="${msgData.message[0].component.payload.text}"> \
                                      {{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                      {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                          <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                      {{/if}} \
                                  </li>\
                                  {{each(key, msgItem) msgData.message[0].component.payload.buttons}} \
                                      <a>\
                                          <li {{if msgData}}msgData="${JSON.stringify(msgData)}"{{/if}} {{if msgItem.payload}}value="${msgItem.payload}" id="${msgItem.payload}" onClick="openLink(`${msgItem.payload}`)" {{/if}} {{if msgItem.payload}}actual-value="${msgItem.payload}"{{/if}} {{if msgItem.url}}url="${msgItem.url}"{{/if}} class="buttonTmplContentChild" data-value="${msgItem.value}" type="${msgItem.type}">\
                                              ${msgItem.title}\
                                          </li> \
                                      </a> \
                                  {{/each}} \
                              </ul>\
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          }
  
          var pieChartTemplate =
            '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon piechart"> \
                          {{if msgData.createdOn}}<div class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                          {{if msgData.icon}}<div class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(/bot-avatar.png)"></div> </div> {{/if}} \
                          {{if msgData.message[0].component.payload.text}}<div class="messageBubble pieChart">\
                              <span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
                          </div>{{/if}}\
                          <div id="d3Pie">\
                          </div>\
                          <div class="piechartDiv">\
                              <div class="lineChartChildDiv" id="piechart${msgData.messageId}"></div>\
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
  
          var barchartTemplate =
            '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon barchart"> \
                          {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                          {{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(/bot-avatar.png)"></div> </div> {{/if}} \
                          {{if msgData.message[0].component.payload.text}}<div class="messageBubble barchart">\
                              <span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
                          </div>{{/if}}\
                          <div class="barchartDiv">\
                              <div class="lineChartChildDiv" id="barchart${msgData.messageId}"></div>\
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          var linechartTemplate =
            '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon linechart"> \
                          {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                          {{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(/bot-avatar.png)"></div> </div> {{/if}} \
                          {{if msgData.message[0].component.payload.text}}<div class="messageBubble linechart">\
                              <span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
                          </div>{{/if}}\
                          <div class="linechartDiv">\
                              <div class="lineChartChildDiv" id="linechart${msgData.messageId}"></div>\
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          var miniTableChartTemplate =
            '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon tablechart"> \
                          {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                          {{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(/bot-avatar.png)"></div> </div> {{/if}} \
                          {{if msgData.message[0].component.payload.text}}<div class="messageBubble tableChart">\
                              <span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
                          </div>{{/if}}\
                          {{each(key, table) msgData.message[0].component.payload.elements}}\
                              <div class="minitableDiv">\
                                  <div style="overflow-x:auto; padding: 0 8px;">\
                                      <table cellspacing="0" cellpadding="0">\
                                          <tr class="headerTitle">\
                                              {{each(key, tableHeader) table.primary}} \
                                                  <th {{if tableHeader[1]}}style="text-align:${tableHeader[1]};" {{/if}}>${tableHeader[0]}</th>\
                                              {{/each}} \
                                          </tr>\
                                          {{each(key, additional) table.additional}} \
                                              <tr>\
                                                  {{each(cellkey, cellValue) additional}} \
                                                      <td  {{if cellkey === additional.length-1}}colspan="2"{{/if}}  {{if table.primary[cellkey][1]}}style="text-align:${table.primary[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                                  {{/each}} \
                                              </tr>\
                                          {{/each}} \
                                      </table>\
                                  </div>\
                              </div>\
                          {{/each}}\
                      </li> \
                  {{/if}} \
              </scipt>';
  
          var miniTableHorizontalTemplate =
            '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                  <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                      class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon tablechart"> \
                      {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                      {{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(/bot-avatar.png)"></div> </div> {{/if}} \
                      {{if msgData.message[0].component.payload.text}}<div class="messageBubble tableChart">\
                          <span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
                      </div>{{/if}}\
                      <div class="carousel" id="carousel-one-by-one" style="height: 0px;">\
                          {{each(key, table) msgData.message[0].component.payload.elements}}\
                              <div class="slide">\
                                  <div class="minitableDiv">\
                                      <div style="overflow-x:auto; padding: 0 8px;">\
                                          <table cellspacing="0" cellpadding="0">\
                                              <tr class="headerTitle">\
                                                  {{each(key, tableHeader) table.primary}} \
                                                      <th {{if tableHeader[1]}}style="text-align:${tableHeader[1]};" {{/if}}>${tableHeader[0]}</th>\
                                                  {{/each}} \
                                              </tr>\
                                              {{each(key, additional) table.additional}} \
                                                  <tr>\
                                                      {{each(cellkey, cellValue) additional}} \
                                                          <td  {{if cellkey === additional.length-1}}colspan="2"{{/if}}  {{if table.primary[cellkey][1]}}style="text-align:${table.primary[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                                      {{/each}} \
                                                  </tr>\
                                              {{/each}} \
                                          </table>\
                                      </div>\
                                  </div>\
                              </div>\
                          {{/each}}\
                      </div>\
                  </li> \
                  {{/if}} \
              </scipt>';
  
          var tableChartTemplate =
            '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon tablechart"> \
                          {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                          {{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom" > <div class="user-account avtar" style="background-image:url(/bot-avatar.png)"></div> </div> {{/if}} \
                          {{if msgData.message[0].component.payload.text}}<div class="messageBubble tableChart">\
                              <span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
                          </div>{{/if}}\
                          <div class="tablechartDiv {{if msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}regular{{else}}hide{{/if}}">\
                              <div style="overflow-x:auto; padding: 0 8px;">\
                                  <table cellspacing="0" cellpadding="0">\
                                      <tr class="headerTitle">\
                                          {{each(key, tableHeader) msgData.message[0].component.payload.columns}} \
                                              <th {{if tableHeader[1]}}style="text-align:${tableHeader[1]};"{{/if}}>${tableHeader[0]}</th>\
                                          {{/each}} \
                                      </tr>\
                                      {{each(key, tableRow) msgData.message[0].component.payload.elements}} \
                                          {{if tableRow.Values.length>1}}\
                                              <tr {{if key > 4}}class="hide"{{/if}}>\
                                                  {{each(cellkey, cellValue) tableRow.Values}} \
                                                      <td  {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                                  {{/each}} \
                                              </tr>\
                                          {{/if}}\
                                      {{/each}} \
                                  </table>\
                              </div>\
                              {{if msgData.message[0].component.payload.elements.length > 5 && msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}<div class="showMore">Show more</div>{{/if}}\
                          </div>\
                           <div class="accordionTable {{if msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}hide{{else}}responsive{{/if}}">\
                              {{each(key, tableRow) msgData.message[0].component.payload.elements}} \
                                  {{if key < 4}}\
                                      <div class="accordionRow">\
                                          {{each(cellkey, cellValue) tableRow.Values}} \
                                              {{if cellkey < 2}}\
                                                  <div class="accordionCol">\
                                                      <div class="colTitle hideSdkEle">${msgData.message[0].component.payload.columns[cellkey][0]}</div>\
                                                      <div class="colVal">${cellValue}</div>\
                                                  </div>\
                                              {{else}}\
                                                  <div class="accordionCol hideSdkEle">\
                                                      <div class="colTitle">${msgData.message[0].component.payload.columns[cellkey][0]}</div>\
                                                      <div class="colVal">${cellValue}</div>\
                                                  </div>\
                                              {{/if}}\
                                          {{/each}} \
                                          <span class="fa fa-caret-right tableBtn"></span>\
                                      </div>\
                                  {{/if}}\
                              {{/each}} \
                              <div class="showMore">Show more</div>\
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
  
          var tableAccordianTemplate;
          if (hostnameGTLOrUNL == "GTL") {
            tableAccordianTemplate =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon tablechart"> \
                          {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                          {{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(../UI/libs/images/Bot_Response_Icon.png);margin-top: -10px;"></div> </div> {{/if}} \
                          <div class="tablechartDiv1 {{if msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}regular{{else}}hide{{/if}}">\
                              <div style="overflow-x:auto; padding: 0 8px;">\
                                  <table cellspacing="0"  cellpadding="0" id="data-table">\
                                  <tr class="headerTitle">\
                                  <th>Policy #</th>\
                                  <th>Insured</th>\
                                  <th>Plan</th>\
                                  <th>Status</th>\
                              </tr>\
                          {{each(key, tableRow) msgData.message[0].component.payload.elements}} \
                              {{if tableRow.Values.length>1}}\
                                  <tr {{if key > 4}}style="display:none;" id="${msgData.createdOnTimemillis}" {{/if}} onClick="toggleRow(this)">\
                                      {{each(cellkey, cellValue) tableRow.Values}} \
                                          {{if cellkey===0}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                          {{if cellkey===1}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                          {{if cellkey===2}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                          {{if cellkey===3}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                      {{/each}} \
                                      {{each(cellkey, cellValue) tableRow.Values}} \
                                          {{if cellkey===0}}\
                                          <td><div id="modal-btn" class="accordianCustomeTable" style="color: blue;font-weight: bolder;> <span>></span> </div></td>\
                                      {{/if}}\
                                      {{/each}} \
                                  </tr>\
                                  <tr class="hidden">\
                                  <td colspan="12">\
                                      <div class="cardview">\
                                          {{each(cellkey, cellValue) tableRow.Values}} \
                                              {{if cellkey===4}}\
                                                  <p>Issued : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===5}}\
                                                  <p>Paid to: ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===6}}\
                                                  <p>Premium: ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===7}}\
                                                  <p>Mode : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===8}}\
                                                  <p>Method : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===9}}\
                                                  <p>Draft Date : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===3}}\
                                                  <p>Status : ${cellValue}\
                                                  {{if cellValue==="Pending"}}\
                                                      <span style="color: blue !important;" onClick="viewMoreContent(${msgData.createdOnTimemillis}${key})"> View More</p>\
                                                  {{/if}}\
                                                   {{if cellValue === "Active"}}\
                                                      {{if tableRow.Values[16]}}\
                                                      <a style="color: blue !important;" href="${tableRow.Values[16]}">View Policy Document</a>\
                                                      {{else}}\
                                                      <span style="color: blue;">View Policy Document</span>\
                                                      {{/if}}\
                                                   {{/if}}\
                                                   <div style="display:none;" id="${msgData.createdOnTimemillis}${key}">This application is in Underwriting Review <p>Notes:<br>${tableRow.Values[17]}</p> </div>\
                                              {{/if}}\
                                          {{/each}}\
                                      </div>\
                                       </td>\
                                  </tr>\
                              {{/if}}\
                          {{/each}}                                 </table>\
                              </div>\
                              {{if msgData.message[0].component.payload.elements.length > 5 && msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}<div class="showmoreRows" onClick="morethanFiveRows(${msgData.createdOnTimemillis})">Show more</div>{{/if}}\
                          </div>\
                         </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          } else if (hostnameGTLOrUNL == "UNL") {
            tableAccordianTemplate =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon tablechart"> \
                          {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                          {{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(../UI/libs/images/Bot_Response_Icon.png);margin-top: -10px;"></div> </div> {{/if}} \
                          <div class="tablechartDiv1 {{if msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}regular{{else}}hide{{/if}}">\
                              <div style="overflow-x:auto; padding: 0 8px;">\
                                  <table cellspacing="0"  cellpadding="0" id="data-table">\
                                  <tr class="headerTitle">\
                                  <th>Policy #</th>\
                                  <th>Insured</th>\
                                  <th>Description</th>\
                                  <th>Status</th>\
                              </tr>\
                          {{each(key, tableRow) msgData.message[0].component.payload.elements}} \
                              {{if tableRow.Values.length>1}}\
                                  <tr {{if key > 4}}style="display:none;" id="${msgData.createdOnTimemillis}" {{/if}} onClick="toggleRow(this)">\
                                      {{each(cellkey, cellValue) tableRow.Values}} \
                                          {{if cellkey===0}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                          {{if cellkey===1}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                          {{if cellkey===2}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                          {{if cellkey===3}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                      {{/each}} \
                                      {{each(cellkey, cellValue) tableRow.Values}} \
                                          {{if cellkey===0}}\
                                          <td><div id="modal-btn" class="accordianCustomeTable" style="color: blue;font-weight: bolder;> <span>></span> </div></td>\
                                      {{/if}}\
                                      {{/each}} \
                                  </tr>\
                                  <tr class="hidden">\
                                  <td colspan="12">\
                                      <div class="cardview">\
                                          {{each(cellkey, cellValue) tableRow.Values}} \
                                              {{if cellkey===4}}\
                                                  <p>Issued: ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===5}}\
                                                  <p>Paid to : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===6}}\
                                                  <p>Premium : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===7}}\
                                                  <p>Mode : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===8}}\
                                                  <p>Method : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===9}}\
                                                  <p>Draft Date : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===3}}\
                                                  <p>Status : ${cellValue}\
                                                  {{if cellValue==="Pending"}}\
                                                      <span style="color: blue !important;" onClick="viewMoreContent(${msgData.createdOnTimemillis}${key})"> View More</p>\
                                                  {{/if}}\
                                                   {{if cellValue === "Active"}}\
                                                      {{if tableRow.Values[16]}}\
                                                      <a style="color: blue !important;" href="${tableRow.Values[16]}">View Policy Document</a>\
                                                      {{else}}\
                                                      <span style="color: blue;">View Policy Document</span>\
                                                      {{/if}}\
                                                   {{/if}}\
                                                   <div style="display:none;" id="${msgData.createdOnTimemillis}${key}">This application is in Underwriting Review <p>*Notes*:<br>${tableRow.Values[17]}</p></div>\
                                              {{/if}}\
                                          {{/each}}\
                                      </div>\
                                       </td>\
                                  </tr>\
                              {{/if}}\
                          {{/each}}                                 </table>\
                              </div>\
                              {{if msgData.message[0].component.payload.elements.length > 5 && msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}<div class="showmoreRows" onClick="morethanFiveRows(${msgData.createdOnTimemillis})">Show more</div>{{/if}}\
                          </div>\
                         </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          } else {
            tableAccordianTemplate =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon tablechart"> \
                          {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                          {{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(../UI/libs/images/Bot_Response_Icon.png);margin-top: -10px;"></div> </div> {{/if}} \
                           <div class="messageBubble">\
                              <span>Here&#39;s what we have found  </span>\
                          </div>\
                          <div class="tablechartDiv1 {{if msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}regular{{else}}hide{{/if}}">\
                              <div style="overflow-x:auto; padding: 0 8px;">\
                                  <table cellspacing="0"  cellpadding="0" id="data-table">\
                                      <tr class="headerTitle">\
                                          {{each(key, tableHeader) msgData.message[0].component.payload.columns}} \
                                              <th {{if tableHeader[1]}}style="text-align:${tableHeader[1]};"{{/if}}>${tableHeader[0]}</th>\
                                          {{/each}} \
                                      </tr>\
                                      {{each(key, tableRow) msgData.message[0].component.payload.elements}} \
                                          {{if tableRow.Values.length>1}}\
                                              <tr {{if key > 4}}style="display:none;" id="${msgData.createdOnTimemillis}" {{/if}} onClick="toggleRow(this)">\
                                                  {{each(cellkey, cellValue) tableRow.Values}} \
                                                      <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                                  {{/each}} \
                                                  {{each(cellkey, cellValue) tableRow.Values}} \
                                                      {{if cellkey===0}}\
                                                      <td><div id="modal-btn" class="accordianCustomeTable" style="color: blue;font-weight: bolder;> <span>></span> </div></td>\
                                                  {{/if}}\
                                                  {{/each}} \
                                              </tr>\
                                              <tr class="hidden">\
                                              <td colspan="12">\
                                                  <div class="cardview">\
                                                      {{each(cellkey, cellValue) tableRow.Values}} \
                                                          {{if cellkey===0}}\
                                                              <p>Policy No.: ${cellValue}</p>\
                                                          {{/if}}\
                                                          {{if cellkey===1}}\
                                                              <p>Insured : ${cellValue}</p>\
                                                          {{/if}}\
                                                          {{if cellkey===2}}\
                                                              <p>Plan Description : ${cellValue}</p>\
                                                          {{/if}}\
                                                          {{if cellkey===3}}\
                                                              <p>Status : ${cellValue}\
                                                              {{if cellValue==="Pending"}}\
                                                               <span style="color: blue !important;" onClick="viewMoreContent(${msgData.createdOnTimemillis}${key})"> View More</p>\
                                                               {{/if}}\
                                                               <div style="display:none;" id="${msgData.createdOnTimemillis}${key}">This is Pending policy </div>\
                                                          {{/if}}\
                                                      {{/each}}\
                                                  </div>\
                                                   </td>\
                                              </tr>\
                                          {{/if}}\
                                      {{/each}} \
                                  </table>\
                              </div>\
                              {{if msgData.message[0].component.payload.elements.length > 5 && msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}<div class="showmoreRows" onClick="morethanFiveRows(${msgData.createdOnTimemillis})">Show more</div>{{/if}}\
                          </div>\
                         </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          }
  
          var tableAccordianTemplate1;
          if (hostnameGTLOrUNL == "GTL") {
            tableAccordianTemplate1 =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon tablechart"> \
                          {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                          {{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(../UI/libs/images/Bot_Response_Icon.png);margin-top: -10px;"></div> </div> {{/if}} \
                           <div class="messageBubble">\
                              <span>Here\'s what we have found</span>\
                          </div>\
                          <div class="tablechartDiv1 {{if msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}regular{{else}}hide{{/if}}">\
                              <div style="overflow-x:auto; padding: 0 8px;">\
                                  <table cellspacing="0"  cellpadding="0" id="data-table">\
                                  <tr class="headerTitle">\
                                  <th>Policy #</th>\
                                  <th>Insured</th>\
                                  <th>Plan</th>\
                                  <th>Status</th>\
                              </tr>\
                          {{each(key, tableRow) msgData.message[0].component.payload.elements}} \
                              {{if tableRow.Values.length>1}}\
                                  <tr {{if key > 4}}style="display:none;" id="${msgData.createdOnTimemillis}" {{/if}} onClick="toggleRow(this)">\
                                      {{each(cellkey, cellValue) tableRow.Values}} \
                                          {{if cellkey===0}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                          {{if cellkey===1}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                          {{if cellkey===2}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                          {{if cellkey===3}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                      {{/each}} \
                                      {{each(cellkey, cellValue) tableRow.Values}} \
                                          {{if cellkey===0}}\
                                          <td><div id="modal-btn" class="accordianCustomeTable" style="color: blue;font-weight: bolder;> <span>></span> </div></td>\
                                      {{/if}}\
                                      {{/each}} \
                                  </tr>\
                                  <tr class="hidden">\
                                  <td colspan="12">\
                                      <div class="cardview">\
                                          {{each(cellkey, cellValue) tableRow.Values}} \
                                              {{if cellkey===4}}\
                                                  <p>Issued : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===5}}\
                                                  <p>Paid to : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===6}}\
                                                  <p>Premium : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===7}}\
                                                  <p>Mode : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===8}}\
                                                  <p>Method : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===9}}\
                                                  <p>Draft Date : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===3}}\
                                                  <p>Status : ${cellValue}\
                                                  {{if cellValue==="Pending"}}\
                                                      <span style="color: blue !important;" onClick="viewMoreContent(${msgData.createdOnTimemillis}${key})"> View More</p>\
                                                  {{/if}}\
                                                  {{if cellkey===3}}\
                                                  <p>Status : ${cellValue}\
                                                  {{if cellValue==="Pending"}}\
                                                      <span style="color: blue !important;" onClick="viewMoreContent(${msgData.createdOnTimemillis}${key})"> View More</p>\
                                                  {{/if}}\
                                                   {{if cellValue === "Active"}}\
                                                      {{if tableRow.Values[16]}}\
                                                      <a style="color: blue !important;" href="${tableRow.Values[16]}">View Policy Document</a>\
                                                      {{else}}\
                                                      <span style="color: blue;">View Policy Document</span>\
                                                      {{/if}}\
                                                   {{/if}}\
                                                   <div style="display:none;" id="${msgData.createdOnTimemillis}${key}">This application is in Underwriting Review </div>\
                                              {{/if}}\
                                          {{/each}}\
                                      </div>\
                                       </td>\
                                  </tr>\
                              {{/if}}\
                          {{/each}}                                 </table>\
                              </div>\
                              {{if msgData.message[0].component.payload.elements.length > 5 && msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}<div class="showmoreRows" onClick="morethanFiveRows(${msgData.createdOnTimemillis})">Show more</div>{{/if}}\
                          </div>\
                         </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          } else if (hostnameGTLOrUNL == "UNL") {
            tableAccordianTemplate1 =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon tablechart"> \
                          {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                          {{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(../UI/libs/images/Bot_Response_Icon.png);margin-top: -10px;"></div> </div> {{/if}} \
                           <div class="messageBubble">\
                              <span>Here\'s what we have found</span>\
                          </div>\
                          <div class="tablechartDiv1 {{if msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}regular{{else}}hide{{/if}}">\
                              <div style="overflow-x:auto; padding: 0 8px;">\
                                  <table cellspacing="0"  cellpadding="0" id="data-table">\
                                  <tr class="headerTitle">\
                                  <th>Policy #</th>\
                                  <th>Insured</th>\
                                  <th>Plan</th>\
                                  <th>Status</th>\
                              </tr>\
                          {{each(key, tableRow) msgData.message[0].component.payload.elements}} \
                              {{if tableRow.Values.length>1}}\
                                  <tr {{if key > 4}}style="display:none;" id="${msgData.createdOnTimemillis}" {{/if}} onClick="toggleRow(this)">\
                                      {{each(cellkey, cellValue) tableRow.Values}} \
                                          {{if cellkey===0}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                          {{if cellkey===1}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                          {{if cellkey===2}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                          {{if cellkey===3}}\
                                              <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                          {{/if}}\
                                      {{/each}} \
                                      {{each(cellkey, cellValue) tableRow.Values}} \
                                          {{if cellkey===0}}\
                                          <td><div id="modal-btn" class="accordianCustomeTable" style="color: blue;font-weight: bolder;> <span>></span> </div></td>\
                                      {{/if}}\
                                      {{/each}} \
                                  </tr>\
                                  <tr class="hidden">\
                                  <td colspan="12">\
                                      <div class="cardview">\
                                          {{each(cellkey, cellValue) tableRow.Values}} \
                                              {{if cellkey===4}}\
                                                  <p>Issued : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===5}}\
                                                  <p>Paid to : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===6}}\
                                                  <p>Premium : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===7}}\
                                                  <p>Mode : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===8}}\
                                                  <p>Method : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===9}}\
                                                  <p>Draft Date : ${cellValue}</p>\
                                              {{/if}}\
                                              {{if cellkey===3}}\
                                                  <p>Status : ${cellValue}\
                                                  {{if cellValue==="Pending"}}\
                                                      <span style="color: blue !important;" onClick="viewMoreContent(${msgData.createdOnTimemillis}${key})"> View More</p>\
                                                  {{/if}}\
                                                  {{if cellkey===3}}\
                                                  <p>Status : ${cellValue}\
                                                  {{if cellValue==="Pending"}}\
                                                      <span style="color: blue !important;" onClick="viewMoreContent(${msgData.createdOnTimemillis}${key})"> View More</p>\
                                                  {{/if}}\
                                                   {{if cellValue === "Active"}}\
                                                      {{if tableRow.Values[16]}}\
                                                      <a style="color: blue !important;" href="${tableRow.Values[16]}">View Policy Document</a>\
                                                      {{else}}\
                                                      <span style="color: blue;">View Policy Document</span>\
                                                      {{/if}}\
                                                   {{/if}}\
                                                   <div style="display:none;" id="${msgData.createdOnTimemillis}${key}">This application is in Underwriting Review </div>\
                                              {{/if}}\
                                          {{/each}}\
                                      </div>\
                                       </td>\
                                  </tr>\
                              {{/if}}\
                          {{/each}}                                 </table>\
                              </div>\
                              {{if msgData.message[0].component.payload.elements.length > 5 && msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}<div class="showmoreRows" onClick="morethanFiveRows(${msgData.createdOnTimemillis})">Show more</div>{{/if}}\
                          </div>\
                         </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          } else {
            tableAccordianTemplate1 =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon tablechart"> \
                          {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                          {{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(../UI/libs/images/Bot_Response_Icon.png);margin-top: -10px;"></div> </div> {{/if}} \
                           <div class="messageBubble">\
                              <span>Here’s what we’ve found</span>\
                          </div>\
                          <div class="tablechartDiv1 {{if msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}regular{{else}}hide{{/if}}">\
                              <div style="overflow-x:auto; padding: 0 8px;">\
                                  <table cellspacing="0"  cellpadding="0" id="data-table">\
                                          <tr class="headerTitle">\
                                              <th>Policy #</th>\
                                              <th>Insured Name</th>\
                                              <th>Plan Description</th>\
                                              <th>Policy Status</th>\
                                          </tr>\
                                      {{each(key, tableRow) msgData.message[0].component.payload.elements}} \
                                          {{if tableRow.Values.length>1}}\
                                              <tr {{if key > 4}}style="display:none;" id="${msgData.createdOnTimemillis}" {{/if}} onClick="toggleRow(this)">\
                                                  {{each(cellkey, cellValue) tableRow.Values}} \
                                                      {{if cellkey===0}}\
                                                          <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                                      {{/if}}\
                                                      {{if cellkey===1}}\
                                                          <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                                      {{/if}}\
                                                      {{if cellkey===2}}\
                                                          <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                                      {{/if}}\
                                                      {{if cellkey===3}}\
                                                          <td id="${cellkey}" data-target="${cellkey}" {{if cellkey === tableRow.Values.length-1}}colspan="2"{{/if}} class=" {{if key == 0}} addTopBorder {{/if}}" {{if msgData.message[0].component.payload.columns[cellkey][1]}}style="text-align:${msgData.message[0].component.payload.columns[cellkey][1]};" {{/if}} title="${cellValue}">${cellValue}</td>\
                                                      {{/if}}\
                                                  {{/each}} \
                                                  {{each(cellkey, cellValue) tableRow.Values}} \
                                                      {{if cellkey===0}}\
                                                      <td><div id="modal-btn" class="accordianCustomeTable" style="color: blue;font-weight: bolder;> <span>></span> </div></td>\
                                                  {{/if}}\
                                                  {{/each}} \
                                              </tr>\
                                              <tr class="hidden">\
                                              <td colspan="12">\
                                                  <div class="cardview">\
                                                      {{each(cellkey, cellValue) tableRow.Values}} \
                                                          {{if cellkey===4}}\
                                                              <p>Issue date (effective date): ${cellValue}</p>\
                                                          {{/if}}\
                                                          {{if cellkey===5}}\
                                                              <p>Paid to Date : ${cellValue}</p>\
                                                          {{/if}}\
                                                          {{if cellkey===6}}\
                                                              <p>Premium amount : ${cellValue}</p>\
                                                          {{/if}}\
                                                          {{if cellkey===7}}\
                                                              <p>Premium mode : ${cellValue}</p>\
                                                          {{/if}}\
                                                          {{if cellkey===8}}\
                                                              <p>Premium method : ${cellValue}</p>\
                                                          {{/if}}\
                                                          {{if cellkey===9}}\
                                                              <p>Draft/Bill Date : ${cellValue}</p>\
                                                          {{/if}}\
                                                          {{if cellkey===3}}\
                                                              <p>Status : ${cellValue}\
                                                              {{if cellValue==="Pending"}}\
                                                               <span style="color: blue !important;" onClick="viewMoreContent(${msgData.createdOnTimemillis}${key})"> View More</p>\
                                                               {{/if}}\
                                                               <div style="display:none;" id="${msgData.createdOnTimemillis}${key}">This is Pending policy </div>\
                                                          {{/if}}\
                                                      {{/each}}\
                                                  </div>\
                                                   </td>\
                                              </tr>\
                                          {{/if}}\
                                      {{/each}} \
                                  </table>\
                              </div>\
                              {{if msgData.message[0].component.payload.elements.length > 5 && msgData.message[0].component.payload.table_design && msgData.message[0].component.payload.table_design == "regular"}}<div class="showmoreRows" onClick="morethanFiveRows(${msgData.createdOnTimemillis})">Show more</div>{{/if}}\
                          </div>\
                         </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          }
  
          var carouselTemplate =
            '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
                          {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                          {{if msgData.icon}}<div aria-live="off" class="profile-photo extraBottom"> <div class="user-account avtar" style="background-image:url(/bot-avatar.png)"></div> </div> {{/if}} \
                          {{if msgData.message[0].component.payload.text}}<div class="messageBubble tableChart">\
                              <span>{{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}}</span>\
                          </div>{{/if}}\
                          <div class="carousel" id="carousel-one-by-one" style="height: 0px;">\
                              {{each(key, msgItem) msgData.message[0].component.payload.elements}} \
                                  <div class="slide">\
                                      {{if msgItem.image_url}} \
                                          <div class="carouselImageContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
                                              <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                          </div> \
                                      {{/if}} \
                                      <div class="carouselTitleBox"> \
                                          <p class="carouselTitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.title, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.title, "user")}} {{/if}}</p> \
                                          {{if msgItem.subtitle}}<p class="carouselDescription">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "user")}} {{/if}}</p>{{/if}} \
                                          {{if msgItem.default_action && msgItem.default_action.type === "web_url"}}<div class="listItemPath carouselDefaultAction" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
                                          {{if msgItem.buttons}} \
                                              {{each(key, msgBtn) msgItem.buttons}} \
                                                  <div {{if msgBtn.payload}}value="${msgBtn.payload}"{{/if}} {{if msgBtn.url}}url="${msgBtn.url}"{{/if}} class="listItemPath carouselButton" data-value="${msgBtn.value}" type="${msgBtn.type}">\
                                                      ${msgBtn.title}\
                                                  </div> \
                                              {{/each}} \
                                          {{/if}} \
                                      </div>\
                                  </div>\
                              {{/each}} \
                          </div>\
                      </li> \
                  {{/if}}\
              </scipt>';
  
          var quickReplyTemplate;
          if (hostnameGTLOrUNL == "GTL") {
            quickReplyTemplate =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon quickReplies"> \
                          <div class="buttonTmplContent" style="margin-left: 40px;"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info" style="padding-left: 0px;">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar marginT50" style="background-image:url(/bot-avatar.png);margin-top: 0px;"></div> </div> {{/if}} \
                              {{if msgData.message[0].component.payload.text}} \
                               <div class="buttonTmplContentHeading quickReply" style="border-bottom-right-radius: 10px;border-bottom-left-radius: 10px;"> \
                               {{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                      {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                          <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                      {{/if}} \
                                      {{if msgData.message[0].component.payload.quick_replies && msgData.message[0].component.payload.quick_replies.length}} \
                                  <div class="fa fa-chevron-left quickreplyLeftIcon hide"></div><div class="fa fa-chevron-right quickreplyRightIcon"></div>\
                                      <div class="quick_replies_btn_parent"><div class="autoWidth">\
                                          {{each(key, msgItem) msgData.message[0].component.payload.quick_replies}} \
                                              <div class="buttonTmplContentChild quickReplyDiv"> <span {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} class="quickReply {{if msgItem.image_url}}with-img{{/if}}" type="${msgItem.content_type}">\
                                                  {{if msgItem.image_url}}<img src="${msgItem.image_url}">{{/if}} <span class="quickreplyText {{if msgItem.image_url}}with-img{{/if}}">${msgItem.title}</span></span>\
                                              </div> \
                                          {{/each}} \
                                      </div>\
                                  </div>\
                              {{/if}} \
                                  </div>\
                                  {{/if}} \
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          } else if (hostnameGTLOrUNL == "UNL") {
            quickReplyTemplate =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon quickReplies"> \
                          <div class="buttonTmplContent" style="margin-left: 40px;"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info timeButton">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar marginT50" style="background-image:url(../UI/libs/images/UNL_Profile_Icon.png);margin-top: 0px;"></div> </div> {{/if}} \
                              {{if msgData.message[0].component.payload.text}} \
                               <div class="buttonTmplContentHeading quickReply forUNL" style="border-bottom-right-radius: 10px;border-bottom-left-radius: 10px;"> \
                                {{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                      {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                          <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                      {{/if}} \
                                  </div>\
                                  {{/if}} \
                                  {{if msgData.message[0].component.payload.quick_replies && msgData.message[0].component.payload.quick_replies.length}} \
                                  <div class="fa fa-chevron-left quickreplyLeftIcon hide"></div><div class="fa fa-chevron-right quickreplyRightIcon"></div>\
                                      <div class="quick_replies_btn_parent"><div class="autoWidth">\
                                          {{each(key, msgItem) msgData.message[0].component.payload.quick_replies}} \
                                              <div class="buttonTmplContentChild quickReplyDiv forUNL"> <span {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} class="quickReply forUNL{{if msgItem.image_url}}with-img{{/if}}" type="${msgItem.content_type}">\
                                                  {{if msgItem.image_url}}<img src="${msgItem.image_url}">{{/if}} <span class="quickreplyText {{if msgItem.image_url}}with-img{{/if}}">${msgItem.title}</span></span>\
                                              </div> \
                                          {{/each}} \
                                      </div>\
                                  </div>\
                              {{/if}} \
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          } else {
            quickReplyTemplate =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon quickReplies"> \
                          <div class="buttonTmplContent" style="margin-left: 40px;"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info" style="padding-left: 0px;">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar marginT50" style="background-image:url(../UI/libs/images/Bot_Response_Icon.png);margin-top: 0px;"></div> </div> {{/if}} \
                              {{if msgData.message[0].component.payload.text}} \
                               <div class="buttonTmplContentHeading quickReply" style="border-bottom-right-radius: 10px;border-bottom-left-radius: 10px;"> \
                               {{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                      {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                          <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                      {{/if}} \
                                  </div>\
                                  {{/if}} \
                                  {{if msgData.message[0].component.payload.quick_replies && msgData.message[0].component.payload.quick_replies.length}} \
                                  <div class="fa fa-chevron-left quickreplyLeftIcon hide"></div><div class="fa fa-chevron-right quickreplyRightIcon"></div>\
                                      <div class="quick_replies_btn_parent"><div class="autoWidth">\
                                          {{each(key, msgItem) msgData.message[0].component.payload.quick_replies}} \
                                              <div class="buttonTmplContentChild quickReplyDiv"> <span {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} class="quickReply {{if msgItem.image_url}}with-img{{/if}}" type="${msgItem.content_type}">\
                                                  {{if msgItem.image_url}}<img src="${msgItem.image_url}">{{/if}} <span class="quickreplyText {{if msgItem.image_url}}with-img{{/if}}">${msgItem.title}</span></span>\
                                              </div> \
                                          {{/each}} \
                                      </div>\
                                  </div>\
                              {{/if}} \
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          }
  
          //Added By sushil
          var quickReplyTemplate_gridview;
          if (hostnameGTLOrUNL == "GTL") {
            quickReplyTemplate_gridview =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon quickReplies"> \
                          <div class="buttonTmplContent" style="margin-left: 40px;"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info" style="padding-left: 0px;">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar marginT50" style="background-image:url(/bot-avatar.png);margin-top: 0px;"></div> </div> {{/if}} \
                              {{if msgData.message[0].component.payload.text}} \
                               <div class="buttonTmplContentHeading quickReply" style="border-bottom-right-radius: 10px;border-bottom-left-radius: 10px;"> \
                               {{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                      {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                          <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                      {{/if}} \
                                      {{if msgData.message[0].component.payload.quick_replies && msgData.message[0].component.payload.quick_replies.length}} \
                                  <div class="fa fa-chevron-left quickreplyLeftIcon hide"></div><div class="fa fa-chevron-right quickreplyRightIcon"></div>\
                                      <div class="quick_replies_btn_parent"><div class="gridview">\
                                          {{each(key, msgItem) msgData.message[0].component.payload.quick_replies}} \
                                              <div class="buttonTmplContentChild quickReplyDiv"> <span {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} class="quickReply {{if msgItem.image_url}}with-img{{/if}}" type="${msgItem.content_type}">\
                                                  {{if msgItem.image_url}}<img src="${msgItem.image_url}">{{/if}} <span class="quickreplyText {{if msgItem.image_url}}with-img{{/if}}">${msgItem.title}</span></span>\
                                              </div> \
                                          {{/each}} \
                                      </div>\
                                  </div>\
                              {{/if}} \
                                  </div>\
                                  {{/if}} \
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          } else if (hostnameGTLOrUNL == "UNL") {
            quickReplyTemplate_gridview =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon quickReplies"> \
                          <div class="buttonTmplContent" style="margin-left: 40px;"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info timeButton">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar marginT50" style="background-image:url(../UI/libs/images/UNL_Profile_Icon.png);margin-top: 0px;"></div> </div> {{/if}} \
                              {{if msgData.message[0].component.payload.text}} \
                               <div class="buttonTmplContentHeading quickReply forUNL" style="border-bottom-right-radius: 10px;border-bottom-left-radius: 10px;"> \
                                {{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                      {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                          <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                      {{/if}} \
                                  </div>\
                                  {{/if}} \
                                  {{if msgData.message[0].component.payload.quick_replies && msgData.message[0].component.payload.quick_replies.length}} \
                                  <div class="fa fa-chevron-left quickreplyLeftIcon hide"></div><div class="fa fa-chevron-right quickreplyRightIcon"></div>\
                                      <div class="quick_replies_btn_parent"><div class="gridview">\
                                          {{each(key, msgItem) msgData.message[0].component.payload.quick_replies}} \
                                              <div class="buttonTmplContentChild quickReplyDiv forUNL"> <span {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} class="quickReply forUNL{{if msgItem.image_url}}with-img{{/if}}" type="${msgItem.content_type}">\
                                                  {{if msgItem.image_url}}<img src="${msgItem.image_url}">{{/if}} <span class="quickreplyText {{if msgItem.image_url}}with-img{{/if}}">${msgItem.title}</span></span>\
                                              </div> \
                                          {{/each}} \
                                      </div>\
                                  </div>\
                              {{/if}} \
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          } else {
            quickReplyTemplate_gridview =
              '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon quickReplies"> \
                          <div class="buttonTmplContent" style="margin-left: 40px;"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info" style="padding-left: 0px;">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar marginT50" style="background-image:url(../UI/libs/images/Bot_Response_Icon.png);margin-top: 0px;"></div> </div> {{/if}} \
                              {{if msgData.message[0].component.payload.text}} \
                               <div class="buttonTmplContentHeading quickReply" style="border-bottom-right-radius: 10px;border-bottom-left-radius: 10px;"> \
                               {{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                      {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                          <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                      {{/if}} \
                                  </div>\
                                  {{/if}} \
                                  {{if msgData.message[0].component.payload.quick_replies && msgData.message[0].component.payload.quick_replies.length}} \
                                  <div class="fa fa-chevron-left quickreplyLeftIcon hide"></div><div class="fa fa-chevron-right quickreplyRightIcon"></div>\
                                      <div class="quick_replies_btn_parent"><div class="gridview">\
                                          {{each(key, msgItem) msgData.message[0].component.payload.quick_replies}} \
                                              <div class="buttonTmplContentChild quickReplyDiv"> <span {{if msgItem.payload}}value="${msgItem.payload}"{{/if}} class="quickReply {{if msgItem.image_url}}with-img{{/if}}" type="${msgItem.content_type}">\
                                                  {{if msgItem.image_url}}<img src="${msgItem.image_url}">{{/if}} <span class="quickreplyText {{if msgItem.image_url}}with-img{{/if}}">${msgItem.title}</span></span>\
                                              </div> \
                                          {{/each}} \
                                      </div>\
                                  </div>\
                              {{/if}} \
                          </div>\
                      </li> \
                  {{/if}} \
              </scipt>';
          }
  
          var listTemplate =
            '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
                          <div class="listTmplContent"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(/bot-avatar.png)"></div> </div> {{/if}} \
                              <ul class="listTmplContentBox"> \
                                  {{if msgData.message[0].component.payload.text || msgData.message[0].component.payload.heading}} \
                                      <li class="listTmplContentHeading"> \
                                          {{if msgData.type === "bot_response" && msgData.message[0].component.payload.heading}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.heading, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                          {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                              <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                          {{/if}} \
                                      </li> \
                                  {{/if}} \
                                  {{each(key, msgItem) msgData.message[0].component.payload.elements}} \
                                      {{if msgData.message[0].component.payload.buttons}} \
                                          {{if key<= 2 }}\
                                              <li class="listTmplContentChild"> \
                                                  {{if msgItem.image_url}} \
                                                      <div class="listRightContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
                                                          <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                                      </div> \
                                                  {{/if}} \
                                                  <div class="listLeftContent"> \
                                                      <div class="listItemTitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.title, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.title, "user")}} {{/if}}</div> \
                                                      {{if msgItem.subtitle}}<div class="listItemSubtitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "user")}} {{/if}}</div>{{/if}} \
                                                      {{if msgItem.default_action && msgItem.default_action.url}}<div class="listItemPath" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
                                                      {{if msgItem.buttons}}\
                                                      <div> \
                                                          <span class="buyBtn" {{if msgItem.buttons[0].type}}type="${msgItem.buttons[0].type}"{{/if}} {{if msgItem.buttons[0].url}}url="${msgItem.buttons[0].url}"{{/if}} {{if msgItem.buttons[0].payload}}value="${msgItem.buttons[0].payload}"{{/if}}>{{if msgItem.buttons[0].title}}${msgItem.buttons[0].title}{{else}}Buy{{/if}}</span> \
                                                      </div> \
                                                      {{/if}}\
                                                  </div>\
                                              </li> \
                                          {{/if}}\
                                      {{else}} \
                                          <li class="listTmplContentChild"> \
                                              {{if msgItem.image_url}} \
                                                  <div class="listRightContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
                                                      <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';" /> \
                                                  </div> \
                                              {{/if}} \
                                              <div class="listLeftContent"> \
                                                  <div class="listItemTitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.title, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.title, "user")}} {{/if}}</div> \
                                                  {{if msgItem.subtitle}}<div class="listItemSubtitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "user")}} {{/if}}</div>{{/if}} \
                                                  {{if msgItem.default_action && msgItem.default_action.url}}<div class="listItemPath" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
                                                  {{if msgItem.buttons}}\
                                                  <div> \
                                                      <span class="buyBtn" {{if msgItem.buttons[0].type}}type="${msgItem.buttons[0].type}"{{/if}} {{if msgItem.buttons[0].url}}url="${msgItem.buttons[0].url}"{{/if}} {{if msgItem.buttons[0].payload}}value="${msgItem.buttons[0].payload}"{{/if}}>{{if msgItem.buttons[0].title}}${msgItem.buttons[0].title}{{else}}Buy{{/if}}</span> \
                                                  </div> \
                                                  {{/if}}\
                                              </div>\
                                          </li> \
                                      {{/if}} \
                                  {{/each}} \
                                  </li> \
                                  {{if msgData.message[0].component.AlwaysShowGlobalButtons || (msgData.message[0].component.payload.elements.length > 3 && msgData.message[0].component.payload.buttons)}}\
                                  <li class="viewMoreList"> \
                                      <span class="viewMore" url="{{if msgData.message[0].component.payload.buttons[0].url}}${msgData.message[0].component.payload.buttons[0].url}{{/if}}" type="${msgData.message[0].component.payload.buttons[0].type}" value="{{if msgData.message[0].component.payload.buttons[0].payload}}${msgData.message[0].component.payload.buttons[0].payload}{{else}}${msgData.message[0].component.payload.buttons[0].title}{{/if}}">${msgData.message[0].component.payload.buttons[0].title}</span> \
                                  </li> \
                                  {{/if}}\
                              </ul> \
                          </div> \
                      </li> \
                  {{/if}} \
              </scipt>';
  
              var recentPolicyListTemplate =
            '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                    {{if msgData.message}} \
                        <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                            class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
                            <div class="listTmplContent"> \
                                {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                                {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(data:image/png;base64,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)"></div> </div> {{/if}} \
                                <ul class="listTmplContentBox listRecentPolicy"> \
                                    {{if msgData.message[0].component.payload.text || msgData.message[0].component.payload.heading}} \
                                        <li class="listTmplContentHeading"> \
                                            {{if msgData.type === "bot_response" && msgData.message[0].component.payload.heading}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.heading, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                            {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                                <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                            {{/if}} \
                                        </li> \
                                    {{/if}} \
                                    {{each(key, msgItem) msgData.message[0].component.payload.elements}} \
                                        {{if msgData.message[0].component.payload.buttons}} \
                                            {{if key<= 2 }}\
                                                <li class="listTmplContentChild"> \
                                                    {{if msgItem.image_url}} \
                                                        <div class="listRightContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
                                                            <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                                        </div> \
                                                    {{/if}} \
                                                    <div  class="listLeftContent"> \
                                                        <div class="listItemTitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.title, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.title, "user")}} {{/if}}</div> \
                                                        {{if msgItem.subtitle}}<div class="listItemSubtitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "user")}} {{/if}}</div>{{/if}} \
                                                        {{if msgItem.default_action && msgItem.default_action.url}}<div class="listItemPath" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
                                                        {{if msgItem.buttons}}\
                                                        <div> \
                                                            <span class="buyBtn" {{if msgItem.buttons[0].type}}type="${msgItem.buttons[0].type}"{{/if}} {{if msgItem.buttons[0].url}}url="${msgItem.buttons[0].url}"{{/if}} {{if msgItem.buttons[0].payload}}value="${msgItem.buttons[0].payload}"{{/if}}>{{if msgItem.buttons[0].title}}${msgItem.buttons[0].title}{{else}}Buy{{/if}}</span> \
                                                        </div> \
                                                        {{/if}}\
                                                    </div>\
                                                </li> \
                                            {{/if}}\
                                        {{else}} \
                                            <li class="listTmplContentChild"> \
                                                {{if msgItem.image_url}} \
                                                    <div class="listRightContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
                                                        <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';" /> \
                                                    </div> \
                                                {{/if}} \
                                                <div class="listLeftContent" onClick="expandList(`hiddenExpandedView_${msgItem.policy}${msgData.createdOnTimemillis}`)" data-target="hiddenExpandedView_${msgItem.policy}${msgData.createdOnTimemillis}"> \
                                                    <div class="listItemTitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.insured, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.insured, "user")}} {{/if}} \
                                                    <span class="dropdown-icon-policylist">&#9660;</span></div> \
                                                    {{if msgItem.plan}}\
                                                            <div class="listItemSubtitle">\
                                                                {{if msgData.type === "bot_response"}} \
                                                                {{html helpers.convertMDtoHTML(msgItem.plan, "bot")}} \
                                                                {{else}} \
                                                                {{html helpers.convertMDtoHTML(msgItem.plan, "user")}} \
                                                                {{/if}}\
                                                            </div>\
                                                            <div class="listItemSubtitle">Status: ${msgItem.status}</div>\
                                                     {{/if}}\
                                                    {{if msgItem.policy}}<div class="listItemSubtitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.policy, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.policy, "user")}} {{/if}}</div>{{/if}} \
                                                    {{if msgItem.default_action && msgItem.default_action.url}}<div class="listItemPath" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
                                                    {{if msgItem.buttons}}\
                                                    <div> \
                                                        <span class="buyBtn" {{if msgItem.buttons[0].type}}type="${msgItem.buttons[0].type}"{{/if}} {{if msgItem.buttons[0].url}}url="${msgItem.buttons[0].url}"{{/if}} {{if msgItem.buttons[0].payload}}value="${msgItem.buttons[0].payload}"{{/if}}>{{if msgItem.buttons[0].title}}${msgItem.buttons[0].title}{{else}}Buy{{/if}}</span> \
                                                    </div> \
                                                    {{/if}}\
                                                    {{if msgItem.title}}\
                                                      <p class="details-policy" id="detail-panel-${msgItem.title}"> In detail part .... </p> \
                                                    {{/if}}\
                                                    </div>\
                                                    <div id="hiddenExpandedView_${msgItem.policy}${msgData.createdOnTimemillis}" class="toggle-content">\
                                                        <hr>\
                                                        {{if (msgItem.contract_reason_desc == "Incomplete" && msgItem.status == "Pending") || msgItem.status == "License Review"}}\
                                                        <div class="grid-container">\
                                                            <div class="grid-item">Issued: Pending</div>\
                                                            <div class="grid-item">Paid to: Pending</div>\
                                                        </div>\
                                                        {{else}} \
                                                        {{if msgItem.newIssueDate}}\
                                                        <div class="grid-container">\
                                                            <div class="grid-item">\
                                                                {{if msgData.type === "bot_response"}} Issued: {{html helpers.convertMDtoHTML(msgItem.newIssueDate, "bot")}} \
                                                                {{else}} {{html helpers.convertMDtoHTML(msgItem.plan, "user")}} {{/if}}\
                                                            </div>\
                                                            <div class="grid-item">Paid to: ${newPaidToDate}</div>\
                                                        </div>\
                                                        {{/if}}\
                                                        {{/if}}\
                                                    \
                                                        {{if (msgItem.contract_reason_desc == "Incomplete" && msgItem.status == "Pending") || msgItem.status == "License Review"}}\
                                                        <div class="grid-container">\
                                                            <div class="grid-item">Premium: Pending</div>\
                                                            <div class="grid-item">Mode: Pending</div>\
                                                        </div>\
                                                        {{else}} \
                                                        {{if msgItem.premium_Amount>=0}}\
                                                        <div class="grid-container">\
                                                            <div class="grid-item">\
                                                                {{if msgData.type === "bot_response"}}Premium: {{html helpers.convertMDtoHTML(msgItem.premium_Amount_Formatted, "bot")}} \
                                                                {{else}} {{html helpers.convertMDtoHTML(msgItem.plan, "user")}} {{/if}}\
                                                            </div>\
                                                            <div class="grid-item">Mode: ${premium_Mode}</div>\
                                                        </div>\
                                                        {{/if}}\
                                                        {{/if}}\
                                                    \
                                                        {{if (msgItem.contract_reason_desc == "Incomplete" && msgItem.status == "Pending") || msgItem.status == "License Review"}}\
                                                        <div class="grid-container">\
                                                            <div class="grid-item">Method: Pending</div>\
                                                            <div class="grid-item">Bill Date: Pending</div>\
                                                        </div>\
                                                        {{else}} \
                                                        {{if msgItem.method_Of_Payment}}\
                                                        <div class="grid-container">\
                                                            <div class="grid-item">\
                                                                {{if msgData.type === "bot_response"}}Method: {{html helpers.convertMDtoHTML(msgItem.method_Of_Payment, "bot")}} \
                                                                {{else}} {{html helpers.convertMDtoHTML(msgItem.plan, "user")}} {{/if}}\
                                                            </div>\
                                                            <div class="grid-item">Bill Date: ${bill_Day}</div>\
                                                        </div>\
                                                        {{/if}}\
                                                        {{/if}}\
                                                    \
                                                        {{if msgItem.status == "Pending"}}\
                                                        <span>This application is in underwriting review.</span>\
                                                        <div class="listItemSubtitle">\
                                                            {{if msgData.type === "bot_response"}} \
                                                            {{html helpers.convertMDtoHTML()}} \
                                                            {{else}} {{html helpers.convertMDtoHTML(msgItem.plan, "user")}} \
                                                            {{/if}}\
                                                        </div>\
                                                        {{/if}}\
                                                    \
                                                        {{if msgItem.status == "Active" && msgItem.DocLink}}\
                                                        <span style="color: black !important;" onClick="viewMoreContent(${msgData.createdOnTimemillis}${key})"></span>\
                                                        <a style="color: #2174ff !important;" href="${msgItem.DocLink}">View Policy Document</a>\
                                                        <div style="display:none;" id="${msgData.createdOnTimemillis}${key}">\
                                                            <div class="listItemSubtitle">\
                                                                {{if msgData.type === "bot_response"}} \
                                                                {{html helpers.convertMDtoHTML()}} \
                                                                {{else}} {{html helpers.convertMDtoHTML(msgItem.plan, "user")}} \
                                                                {{/if}}\
                                                            </div>\
                                                        </div>\
                                                        {{/if}}\
                                                    </div>\
                                            </li> \
                                        {{/if}} \
                                    {{/each}} \
                                    </li> \
                                    {{if msgData.message[0].component.AlwaysShowGlobalButtons || (msgData.message[0].component.payload.elements.length > 5 && msgData.message[0].component.payload.buttons)}}\
                                    <li class="viewMoreList"> \
                                        <span class="viewMore" url="{{if msgData.message[0].component.payload.buttons[0].url}}${msgData.message[0].component.payload.buttons[0].url}{{/if}}" type="${msgData.message[0].component.payload.buttons[0].type}" value="{{if msgData.message[0].component.payload.buttons[0].payload}}${msgData.message[0].component.payload.buttons[0].payload}{{else}}${msgData.message[0].component.payload.buttons[0].title}{{/if}}">${msgData.message[0].component.payload.buttons[0].title}</span> \
                                    </li> \
                                    {{/if}}\
                                </ul> \
                            </div> \
                        </li> \
                    {{/if}} \
                </scipt>';

                var recentPolicyListTemplateSingleRecord =
                '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                        {{if msgData.message}} \
                            <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                                class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
                                <div class="listTmplContent"> \
                                    {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                                    {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(data:image/png;base64,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)"></div> </div> {{/if}} \
                                    <ul class="listTmplContentBox listRecentPolicy"> \
                                        {{if msgData.message[0].component.payload.text || msgData.message[0].component.payload.heading}} \
                                            <li class="listTmplContentHeading"> \
                                                {{if msgData.type === "bot_response" && msgData.message[0].component.payload.heading}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.heading, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                                {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                                    <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                                {{/if}} \
                                            </li> \
                                        {{/if}} \
                                        {{each(key, msgItem) msgData.message[0].component.payload.elements}} \
                                            {{if msgData.message[0].component.payload.buttons}} \
                                                {{if key<= 2 }}\
                                                    <li class="listTmplContentChild"> \
                                                        {{if msgItem.image_url}} \
                                                            <div class="listRightContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
                                                                <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                                            </div> \
                                                        {{/if}} \
                                                        <div  class="listLeftContent"> \
                                                            <div class="listItemTitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.title, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.title, "user")}} {{/if}}</div> \
                                                            {{if msgItem.subtitle}}<div class="listItemSubtitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "user")}} {{/if}}</div>{{/if}} \
                                                            {{if msgItem.default_action && msgItem.default_action.url}}<div class="listItemPath" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
                                                            {{if msgItem.buttons}}\
                                                            <div> \
                                                                <span class="buyBtn" {{if msgItem.buttons[0].type}}type="${msgItem.buttons[0].type}"{{/if}} {{if msgItem.buttons[0].url}}url="${msgItem.buttons[0].url}"{{/if}} {{if msgItem.buttons[0].payload}}value="${msgItem.buttons[0].payload}"{{/if}}>{{if msgItem.buttons[0].title}}${msgItem.buttons[0].title}{{else}}Buy{{/if}}</span> \
                                                            </div> \
                                                            {{/if}}\
                                                        </div>\
                                                    </li> \
                                                {{/if}}\
                                            {{else}} \
                                                <li class="listTmplContentChild"> \
                                                    {{if msgItem.image_url}} \
                                                        <div class="listRightContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
                                                            <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';" /> \
                                                        </div> \
                                                    {{/if}} \
                                                    <div class="listLeftContent" onClick="expandList(`hiddenExpandedViewSingleRecord_${msgItem.policy}${msgData.createdOnTimemillis}`)" data-target="hiddenExpandedViewSingleRecord_${msgItem.policy}${msgData.createdOnTimemillis}"> \
                                                        <div class="listItemTitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.insured, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.insured, "user")}} {{/if}}\
                                                        <span class="dropdown-icon-policylist">&#9660;</span></div> \
                                                        {{if msgItem.plan}}\
                                                            <div class="listItemSubtitle">\
                                                                {{if msgData.type === "bot_response"}} \
                                                                {{html helpers.convertMDtoHTML(msgItem.plan, "bot")}} \
                                                                {{else}} \
                                                                {{html helpers.convertMDtoHTML(msgItem.plan, "user")}} \
                                                                {{/if}}\
                                                            </div>\
                                                            <div class="listItemSubtitle">Status: ${msgItem.status}</div>\
                                                        {{/if}}\
                                                        {{if msgItem.policy}}<div class="listItemSubtitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.policy, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.policy, "user")}} {{/if}}</div>{{/if}} \
                                                        {{if msgItem.default_action && msgItem.default_action.url}}<div class="listItemPath" type="url" url="${msgItem.default_action.url}">${msgItem.default_action.url}</div>{{/if}} \
                                                        {{if msgItem.buttons}}\
                                                        <div> \
                                                            <span class="buyBtn" {{if msgItem.buttons[0].type}}type="${msgItem.buttons[0].type}"{{/if}} {{if msgItem.buttons[0].url}}url="${msgItem.buttons[0].url}"{{/if}} {{if msgItem.buttons[0].payload}}value="${msgItem.buttons[0].payload}"{{/if}}>{{if msgItem.buttons[0].title}}${msgItem.buttons[0].title}{{else}}Buy{{/if}}</span> \
                                                        </div> \
                                                        {{/if}}\
                                                        {{if msgItem.title}}\
                                                          <p class="details-policy" id="detail-panel-${msgItem.title}"> In detail part .... </p> \
                                                        {{/if}}\
                                                        </div>\
                                                        <div id="hiddenExpandedViewSingleRecord_${msgItem.policy}${msgData.createdOnTimemillis}" class="toggle-content">\
                                                        <hr>\
                                                        {{if (msgItem.contract_Reason_Desc == "Incomplete" && msgItem.status == "Pending") || msgItem.status == "License Review"}}\
                                                        <div class="grid-container">\
                                                            <div class="grid-item">Issued: Pending</div>\
                                                            <div class="grid-item">Paid to: Pending</div>\
                                                        </div>\
                                                        {{else}} \
                                                        {{if msgItem.newIssueDate}}\
                                                        <div class="grid-container">\
                                                            <div class="grid-item">\
                                                                {{if msgData.type === "bot_response"}} Issued: {{html helpers.convertMDtoHTML(msgItem.newIssueDate, "bot")}} \
                                                                {{else}} {{html helpers.convertMDtoHTML(msgItem.plan, "user")}} {{/if}}\
                                                            </div>\
                                                            <div class="grid-item">Paid to: ${newPaidToDate}</div>\
                                                        </div>\
                                                        {{/if}}\
                                                        {{/if}}\
                                                    \
                                                        {{if (msgItem.contract_Reason_Desc == "Incomplete" && msgItem.status == "Pending") || msgItem.status == "License Review"}}\
                                                        <div class="grid-container">\
                                                            <div class="grid-item">Premium: Pending</div>\
                                                            <div class="grid-item">Mode: Pending</div>\
                                                        </div>\
                                                        {{else}} \
                                                        {{if msgItem.premium_Amount>=0}}\
                                                        <div class="grid-container">\
                                                            <div class="grid-item">\
                                                                {{if msgData.type === "bot_response"}}Premium: {{html helpers.convertMDtoHTML(msgItem.premium_Amount_Formatted, "bot")}} \
                                                                {{else}} {{html helpers.convertMDtoHTML(msgItem.plan, "user")}} {{/if}}\
                                                            </div>\
                                                            <div class="grid-item">Mode: ${premium_Mode}</div>\
                                                        </div>\
                                                        {{/if}}\
                                                        {{/if}}\
                                                    \
                                                        {{if (msgItem.contract_Reason_Desc == "Incomplete" && msgItem.status == "Pending") || msgItem.status == "License Review"}}\
                                                        <div class="grid-container">\
                                                            <div class="grid-item">Method: Pending</div>\
                                                            <div class="grid-item">Bill Date: Pending</div>\
                                                        </div>\
                                                        {{else}} \
                                                        {{if msgItem.method_Of_Payment}}\
                                                        <div class="grid-container">\
                                                            <div class="grid-item">\
                                                                {{if msgData.type === "bot_response"}}Method: {{html helpers.convertMDtoHTML(msgItem.method_Of_Payment, "bot")}} \
                                                                {{else}} {{html helpers.convertMDtoHTML(msgItem.plan, "user")}} {{/if}}\
                                                            </div>\
                                                            <div class="grid-item">Bill Date: ${bill_Day}</div>\
                                                        </div>\
                                                        {{/if}}\
                                                        {{/if}}\
                                                    \
                                                        {{if msgItem.status == "Pending"}}\
                                                        <span>This application is in underwriting review.</span>\
                                                        <div class="listItemSubtitle">\
                                                            {{if msgData.type === "bot_response"}} \
                                                            {{html helpers.convertMDtoHTML()}} \
                                                            {{else}} {{html helpers.convertMDtoHTML(msgItem.plan, "user")}} \
                                                            {{/if}}\
                                                        </div>\
                                                        {{/if}}\
                                                    \
                                                        {{if msgItem.status == "Active" && msgItem.DocLink}}\
                                                        <span style="color: black !important;" onClick="viewMoreContent(${msgData.createdOnTimemillis}${key})"></span>\
                                                        <a style="color: #2174ff !important;" href="${msgItem.DocLink}">View Policy Document</a>\
                                                        <div style="display:none;" id="${msgData.createdOnTimemillis}${key}">\
                                                            <div class="listItemSubtitle">\
                                                                {{if msgData.type === "bot_response"}} \
                                                                {{html helpers.convertMDtoHTML()}} \
                                                                {{else}} {{html helpers.convertMDtoHTML(msgItem.plan, "user")}} \
                                                                {{/if}}\
                                                            </div>\
                                                        </div>\
                                                        {{/if}}\
                                                    </div>\
                                                </li> \
                                            {{/if}} \
                                        {{/each}} \
                                        </li> \
                                        {{if msgData.message[0].component.AlwaysShowGlobalButtons || (msgData.message[0].component.payload.elements.length > 5 && msgData.message[0].component.payload.buttons)}}\
                                        <li class="viewMoreList"> \
                                            <span class="viewMore" url="{{if msgData.message[0].component.payload.buttons[0].url}}${msgData.message[0].component.payload.buttons[0].url}{{/if}}" type="${msgData.message[0].component.payload.buttons[0].type}" value="{{if msgData.message[0].component.payload.buttons[0].payload}}${msgData.message[0].component.payload.buttons[0].payload}{{else}}${msgData.message[0].component.payload.buttons[0].title}{{/if}}">${msgData.message[0].component.payload.buttons[0].title}</span> \
                                        </li> \
                                        {{/if}}\
                                    </ul> \
                                </div> \
                            </li> \
                        {{/if}} \
                    </scipt>';      
  
          var listActionSheetTemplate =
            '<script id="chat-window-listTemplate" type="text/x-jqury-tmpl">\
              <div class="list-template-sheet hide">\
               {{if msgData.message}} \
                 <div class="sheetHeader">\
                   <span class="choose">${msgData.message[0].component.payload.heading}</span>\
                   <button class="close-button" title="Close"><img src="data:image/svg+xml;base64,           PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjMgKDY3Mjk3KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5jbG9zZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM0NC4wMDAwMDAsIC0yMjkuMDAwMDAwKSIgZmlsbD0iIzhBOTU5RiI+CiAgICAgICAgICAgIDxnIGlkPSJjbG9zZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ0LjAwMDAwMCwgMjI5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlNoYXBlIiBwb2ludHM9IjE0IDEuNCAxMi42IDAgNyA1LjYgMS40IDAgMCAxLjQgNS42IDcgMCAxMi42IDEuNCAxNCA3IDguNCAxMi42IDE0IDE0IDEyLjYgOC40IDciPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"></button>\
                 </div>\
                 <div class="listTemplateContainer" >\
                      <div class="displayMonth">\
                          {{each(key, tab) tabs}} \
                              <span class="tabs" data-tabid="${tab}"><span class="btnBG">${tab}</span></span>\
                          {{/each}}\
                      </div>\
                        <ul class="displayListValues">\
                            {{each(key, msgItem) dataItems}} \
                                 <li class="listViewTmplContentChild"> \
                                       {{if msgItem.image_url}} \
                                           <div class="listViewRightContent" {{if msgItem.default_action && msgItem.default_action.url}}url="${msgItem.default_action.url}"{{/if}} {{if msgItem.default_action && msgItem.default_action.title}}data-value="${msgItem.default_action.title}"{{/if}} {{if msgItem.default_action && msgItem.default_action.type}}type="${msgItem.default_action.type}"{{/if}} {{if msgItem.default_action && msgItem.default_action.payload}} value="${msgItem.default_action.payload}"{{/if}}> \
                                              <img alt="image" src="${msgItem.image_url}" onerror="this.onerror=null;this.src=\'../libs/img/no_image.png\';"/> \
                                          </div> \
                                      {{/if}} \
                                          <div class="listViewLeftContent" data-url="${msgItem.default_action.url}" data-title="${msgItem.default_action.title}" data-value="${msgItem.default_action.title}"> \
                                             <span class="titleDesc">\
                                                 <div class="listViewItemTitle" title="${msgItem.title}">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.title, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.title, "user")}} {{/if}}</div> \
                                                  {{if msgItem.subtitle}}<div class="listViewItemSubtitle" title="${msgItem.subtitle}">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.subtitle, "user")}} {{/if}}</div>{{/if}} \
                                              </span>\
                                                  {{if msgItem.value}}<div class="listViewItemValue" title="${msgItem.value}">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.value, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.value, "user")}} {{/if}}</div>{{/if}} \
                                          </div>\
                                  </li> \
                             {{/each}} \
                         </ul> \
                 </div>\
             {{/if}}\
         </div>\
       </script>';
          var iframe =
            '<script id="chat_message_tmpl" type="text/x-jquery-tmpl"> \
                      {{if link_url}}\
                         {{if (msgData && msgData.renderType ==="inline")}}\
                              <li class="inlineIframeContainer"> \
                                  <div class="iframeBubble"> \
                                          <div class="uiformComponent">\
                                          <div id="closeInlineModel" role="region" aria-live="polite" aria-atomic="true" aira-label="close Form" class="loading_form iframeLoader"></div>\
                                          <iframe id="inlineIframeModal" src="${link_url}"></iframe> \
                                          </div>\
                                  </div>\
                              </li> \
                          {{else}}\
                              <iframe role="region" aria-live="polite" aria-atomic="true" aira-label="Loadig Form" id="iframeModal" src="${link_url}"></iframe> \
                          {{/if}}\
                      {{else}}\
                          <div role="region" aria-live="polite" aria-atomic="true" class="failedIframe">Failed to load iFrame</div>\
                      {{/if}}\
                  </script>';
  
          var tmpListTemplate =
            '<script id="chat_message_tmpl" type="text/x-jqury-tmpl"> \
                  {{if msgData.message}} \
                      <li data-time="${msgData.createdOnTimemillis}" id="${msgData.messageId || msgItem.clientMessageId}"\
                          class="{{if msgData.type === "bot_response"}}fromOtherUsers{{else}}fromCurrentUser{{/if}} with-icon"> \
                          <div class="listTmplContent"> \
                              {{if msgData.createdOn}}<div aria-live="off" class="extra-info">${helpers.formatDate(msgData.createdOn)}</div>{{/if}} \
                              {{if msgData.icon}}<div aria-live="off" class="profile-photo"> <div class="user-account avtar" style="background-image:url(/bot-avatar.png)"></div> </div> {{/if}} \
                              <ul class="listTmplContentBox"> \
                                  {{if msgData.message[0].component.payload.text || msgData.message[0].component.payload.heading}} \
                                      <li class="listTmplContentHeading"> \
                                          {{if msgData.type === "bot_response" && msgData.message[0].component.payload.heading}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.heading, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgData.message[0].component.payload.text, "user")}} {{/if}} \
                                          {{if msgData.message[0].cInfo && msgData.message[0].cInfo.emoji}} \
                                              <span class="emojione emojione-${msgData.message[0].cInfo.emoji[0].code}">${msgData.message[0].cInfo.emoji[0].title}</span> \
                                          {{/if}} \
                                      </li> \
                                  {{/if}} \
                                  {{each(key, msgItem) msgData.message[0].component.payload.elements}} \
                                      {{if msgData.message[0].component.payload.elements}} \
                                              <li class="listTmplContentChild"> \
                                                  <div class="listLeftContent"> \
                                                      <div class="listItemTitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.title, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.title, "user")}} {{/if}}</div> \
                                                      {{if msgItem.content}}<div class="listItemSubtitle">{{if msgData.type === "bot_response"}} {{html helpers.convertMDtoHTML(msgItem.content, "bot")}} {{else}} {{html helpers.convertMDtoHTML(msgItem.content, "user")}} {{/if}}</div>{{/if}} \
                                                      <!-- <a href="${msgItem.file_url}"> <span class="exclamation-circle"><i class="fa fa-exclamation-circle" aria-hidden="false"></i></span></a> --!> \
                                                      <a href="${msgItem.file_url}">  <span class="file-title">{{html helpers.convertMDtoHTML(msgItem.file_title, "user")}} </span></a> \
                                                  </div>\
                                              </li> \
                                      {{else}} \
                                      {{/if}} \
                                  {{/each}} \
                                  </li> \
                                  {{if msgData.message[0].component.AlwaysShowGlobalButtons || (msgData.message[0].component.payload.elements.length > 3 && msgData.message[0].component.payload.buttons)}}\
                                  <li class="viewMoreList"> \
                                      <span class="viewMore" url="{{if msgData.message[0].component.payload.buttons[0].url}}${msgData.message[0].component.payload.buttons[0].url}{{/if}}" type="${msgData.message[0].component.payload.buttons[0].type}" value="{{if msgData.message[0].component.payload.buttons[0].payload}}${msgData.message[0].component.payload.buttons[0].payload}{{else}}${msgData.message[0].component.payload.buttons[0].title}{{/if}}">${msgData.message[0].component.payload.buttons[0].title}</span> \
                                  </li> \
                                  {{/if}}\
                              </ul> \
                          </div> \
                      </li> \
                  {{/if}} \
              </scipt>';
  
          if (tempType === "message") {
            return msgTemplate;
          } else if (tempType === "popup") {
            return popupTemplate;
          } else if (tempType === "templatebutton") {
            return buttonTemplate;
          } else if (tempType === "templatebutton_forRedirect") {
            return buttonTemplate_forRedirect;
          } else if (tempType === "templatelist") {
            return listTemplate;
          } else if (tempType === "templaterecentpolicylist") {
            console.log("in recentPolicyListTemplate");
            return recentPolicyListTemplate;
          } else if (tempType === "templaterecentpolicylistsinglerecord") {
            return recentPolicyListTemplateSingleRecord;
          } else if (tempType === "tmptemplatelist") {
            return tmpListTemplate;
          } else if (tempType === "templatequickreply") {
            return quickReplyTemplate;
          } else if (tempType === "templatequickreply_gridview") {
            return quickReplyTemplate_gridview;
          } else if (tempType === "templateAttachment") {
            return templateAttachment;
          } else if (tempType === "carouselTemplate") {
            return carouselTemplate;
          } else if (tempType === "pieChartTemplate") {
            return pieChartTemplate;
          } else if (tempType === "tableChartTemplate") {
            return tableChartTemplate;
          } else if (tempType === "tableAccordianTemplate") {
            return tableAccordianTemplate;
          } else if (tempType === "miniTableChartTemplate") {
            return miniTableChartTemplate;
          } else if (tempType === "miniTableHorizontalTemplate") {
            return miniTableHorizontalTemplate;
          } else if (tempType === "barchartTemplate") {
            return barchartTemplate;
          } else if (tempType === "linechartTemplate") {
            return linechartTemplate;
          } else if (tempType === "actionSheetTemplate") {
            return listActionSheetTemplate;
          } else if (tempType === "iframe") {
            return iframe;
          } else {
            return chatWindowTemplate;
          }
        };
  
        chatWindow.prototype.historyLoadingComplete = function () {
          var me = this;
          setTimeout(
            function (me) {
              $(".chatInputBox").focus();
              $(".disableFooter").removeClass("disableFooter");
              me.historyLoading = false;
              if (
                me.config &&
                me.config &&
                me.config.botOptions &&
                me.config.botOptions.webhookConfig &&
                me.config.botOptions.webhookConfig.enable
              ) {
                me.getBotMetaData();
              }
            },
            0,
            me
          );
        };
        chatWindow.prototype.historySyncing = function (msgData, res, index) {
          var me = this;
          try {
            msgData.message[0].cInfo.body = JSON.parse(
              msgData.message[0].cInfo.body
            );
            if (
              msgData.message[0].cInfo.body &&
              msgData.message[0].cInfo.body.text
            ) {
              msgData.message[0].cInfo.body = msgData.message[0].cInfo.body.text;
            }
            msgData.message[0].component = msgData.message[0].cInfo.body;
            if (
              msgData.message[0].component.payload.template_type ===
              "dropdown_template"
            ) {
              msgData.message[0].component.payload.fromHistory = true;
              msgData.message[0].component.selectedValue =
                res[1].messages[index + 1].message[0].cInfo.body;
            }
            if (
              msgData.message[0].component.payload.template_type ===
                "multi_select" ||
              msgData.message[0].component.payload.template_type ===
                "advanced_multi_select"
            ) {
              msgData.message[0].component.payload.fromHistory = true;
            }
            if (
              msgData.message[0].component.payload.template_type ===
              "form_template"
            ) {
              msgData.message[0].component.payload.fromHistory = true;
            }
            if (
              msgData.message[0].component.payload.template_type === "tableList"
            ) {
              msgData.message[0].component.payload.fromHistory = true;
            }
            if (
              msgData.message[0].component.payload.template_type === "listView"
            ) {
              msgData.message[0].component.payload.fromHistory = true;
            }
            // if (msgData.message[0].component.payload.template_type === 'feedbackTemplate') {
            //     msgData.message[0].component.payload.fromHistory = true;
            //     msgData.message[0].cInfo.body="Rate this chat session";
            // }
            if (
              msgData.message[0].component &&
              msgData.message[0].component.payload &&
              (msgData.message[0].component.payload.videoUrl ||
                msgData.message[0].component.payload.audioUrl)
            ) {
              msgData.message[0].cInfo.body = "";
            }
            me.renderMessage(msgData);
          } catch (e) {
            me.renderMessage(msgData);
          }
        };
  
        chatWindow.prototype.chatHistory = function (res) {
          var me = this;
          if (res[2] === "historysync") {
            //setTimeout(function () {
            if (res && res[1] && res[1].messages.length > 0) {
              res[1].messages.forEach(function (msgData, index) {
                setTimeout(function () {
                  if (
                    msgData.type === "outgoing" ||
                    msgData.type === "bot_response"
                  ) {
                    //if ($('.kore-chat-window .chat-container li#' + msgData.messageId).length < 1) {
                    me.historySyncing(msgData, res, index);
                    msgData.fromHistorySync = true;
                    me.renderMessage(msgData);
                    //}
                  }
                }, index * 100);
              });
            }
            //}, 4000);//sync history messages after sockeet messages gets into viewport
          } else if (me.loadHistory) {
            me.historyLoading = true;
            if (res && res[1] && res[1].messages.length > 0) {
              $(".chat-container").hide();
              $(".historyLoadingDiv").addClass("showMsg");
              res[1].messages.forEach(function (msgData, index) {
                msgData.fromHistory = true;
                setTimeout(
                  function (messagesQueue) {
                    // try {
                    //     msgData.message[0].cInfo.body = JSON.parse(msgData.message[0].cInfo.body);
                    //     msgData.message[0].component = msgData.message[0].cInfo.body;
                    //     me.renderMessage(msgData);
                    // } catch (e) {
                    //     me.renderMessage(msgData);
                    // }
                    var _ignoreMsgs = messagesQueue.filter(function (queMsg) {
                      return queMsg.messageId === msgData.messageId;
                    });
                    //dont show the the history message if we already have same message came from socket connect
                    if (!_ignoreMsgs.length) {
                      me.historySyncing(msgData, res, index);
                    }
                    if (index === res[1].messages.length - 1) {
                      setTimeout(
                        function (messagesQueue) {
                          $(".chat-container").show();
                          $(".chat-container").animate(
                            {
                              scrollTop:
                                $(".chat-container").prop("scrollHeight"),
                            },
                            2500
                          );
                          $(".historyLoadingDiv").removeClass("showMsg");
                          if (!me.config.multiPageApp.enable) {
                            $(".chat-container").append(
                              "<div class='endChatContainer'><span class='endChatContainerText'>End of chat history</span></div>"
                            );
                          }
                          if (messagesQueue.length) {
                            messagesQueue.forEach(function (msg, currIndex) {
                              me.renderMessage(msg);
                              if (messagesQueue.length - 1 === currIndex) {
                                messagesQueue = [];
                                me.historyLoadingComplete();
                              }
                            });
                          } else {
                            me.historyLoadingComplete();
                          }
                        },
                        500,
                        messagesQueue
                      );
                    }
                  },
                  index * 100,
                  me.messagesQueue
                );
              });
            } else {
              me.historyLoadingComplete();
            }
          }
        };
        chatWindow.prototype.applyVariableValue = function (key, value, type) {
          try {
            var cssPrefix = "--sdk-chat-custom-";
            var cssVariable = "";
            cssVariable = cssPrefix + "-" + type + "-" + key;
            // console.log(cssVariable+":",value);
            if (value === "square") {
              value = "12px 12px 2px 12px";
            } else if (value === "circle") {
              value = "20px 20px 20px 20px";
            }
            if (cssVariable) {
              document.documentElement.style.setProperty(cssVariable, value);
            }
          } catch (e) {
            console.log(e);
          }
        };
        chatWindow.prototype.applySDKBranding = function (response) {
          if (response && response.activeTheme) {
            for (var key in response) {
              switch (key) {
                case "generalAttributes":
                  if (key && typeof response[key] === "object") {
                    for (var property in response[key]) {
                      this.applyVariableValue(
                        property,
                        response[key][property],
                        key
                      );
                    }
                  }
                  break;
                case "botMessage":
                  if (key && typeof response[key] === "object") {
                    for (var property in response[key]) {
                      this.applyVariableValue(
                        property,
                        response[key][property],
                        key
                      );
                    }
                  }
                  break;
                case "userMessage":
                  if (key && typeof response[key] === "object") {
                    for (var property in response[key]) {
                      this.applyVariableValue(
                        property,
                        response[key][property],
                        key
                      );
                    }
                  }
                  break;
                case "widgetHeader":
                  if (key && typeof response[key] === "object") {
                    for (var property in response[key]) {
                      this.applyVariableValue(
                        property,
                        response[key][property],
                        key
                      );
                    }
                  }
                  break;
                case "widgetFooter":
                  if (key && typeof response[key] === "object") {
                    for (var property in response[key]) {
                      this.applyVariableValue(
                        property,
                        response[key][property],
                        key
                      );
                    }
                  }
                  break;
                case "widgetBody":
                  if (key && typeof response[key] === "object") {
                    for (var property in response[key]) {
                      if (
                        property === "backgroundImage" &&
                        response[key] &&
                        response[key]["useBackgroundImage"]
                      ) {
                        $(".kore-chat-body").css(
                          "background-image",
                          "url(" + response[key]["backgroundImage"] + ")"
                        );
                      } else {
                        this.applyVariableValue(
                          property,
                          response[key][property],
                          key
                        );
                      }
                    }
                  }
                case "buttons":
                  if (key && typeof response[key] === "object") {
                    for (var property in response[key]) {
                      this.applyVariableValue(
                        property,
                        response[key][property],
                        key
                      );
                    }
                  }
                  break;
                case "digitalViews":
                  var defaultTheme = "defaultTheme-kore";
                  if (response && response[key] && response[key].panelTheme) {
                    var digitalViewsThemeMapping = {
                      theme_one: "defaultTheme-kore",
                      theme_two: "darkTheme-kore",
                      theme_three: "defaultTheme-kora",
                      theme_four: "darkTheme-kora",
                    };
                    if (digitalViewsThemeMapping[response[key].panelTheme]) {
                      defaultTheme =
                        digitalViewsThemeMapping[response[key].panelTheme];
                      $(".kr-wiz-menu-chat").addClass(defaultTheme);
                      $(".kr-wiz-menu-chat").removeClass("defaultTheme-kore");
                    }
                  }
                default:
                  break;
              }
            }
            $(".kore-chat-window").addClass("customBranding-theme");
          }
        };
        this.applySDKBranding = function (res) {
          chatInitialize.applySDKBranding.call(chatInitialize, res);
        };
        function IsJsonString() {
          try {
            JSON.parse(str);
          } catch (e) {
            return false;
          }
          return true;
        }
        function insertHtmlData(_txtBox, _html) {
          var _input = _txtBox;
          sel = window.getSelection();
          if (sel.rangeCount > 0) {
            range = sel.getRangeAt(0);
            range.deleteContents();
          }
          prevRange = prevRange ? prevRange : range;
          if (prevRange) {
            node = document.createElement("span");
            prevRange.insertNode(node);
            var _span = document.createElement("span");
            _span.innerHTML = _html;
            prevRange.insertNode(_span);
            prevRange.setEndAfter(node);
            prevRange.setStartAfter(node);
            prevRange.collapse(false);
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(prevRange);
            var focused = document.activeElement;
            if (focused && !focused.className == "chatInputBox") {
              _input.focus();
            }
            return _input;
          } else {
            _input.appendChild(html);
          }
        }
        function setCaretEnd(_this) {
          var sel;
          if (_this && _this.item(0) && _this.item(0).innerText.length) {
            var range = document.createRange();
            range.selectNodeContents(_this[0]);
            range.collapse(false);
            var sel1 = window.getSelection();
            sel1.removeAllRanges();
            sel1.addRange(range);
            prevRange = range;
          } else {
            prevRange = false;
            if (_this && _this[0]) {
              _this[0].focus();
            }
          }
        }
        function strSplit(str) {
          return str.split(".");
        }
        /*function fetchBotDetails(botData,botInfo) {
                  if(botData && botData.userInfo && botData.authorization) {
                      $.ajax({
                          type: "GET",
                          url: koreAPIUrl + "1.1/users/"+botData.userInfo.userId+"/builder/streams/"+botInfo.taskBotId,
                          dataType: "json",
                          headers: {
                              Authorization: "bearer " + botData.authorization.accessToken
                          },
                          success: function (res) {
                              var _speechEnabledForBot = false;
                              for(var i=0; i<res.channels.length;i++) {
                                  if(res.channels[i].type === "rtm") {
                                      _speechEnabledForBot = res.channels[i].sttEnabled || false;
                                      break;
                                  }
                              }
                              var _microPhoneEle = document.getElementsByClassName("sdkFooterIcon microphoneBtn")[0];
                              var _ttsSpeakerEle = document.getElementsByClassName("sdkFooterIcon ttspeakerDiv")[0];
                              if(!_speechEnabledForBot) {
                                  if(_microPhoneEle) {
                                      _microPhoneEle.remove();
                                  }
                                  if(_ttsSpeakerEle) {
                                      _ttsSpeakerEle.remove();
                                  }
                              }
                              else {
                                  if(_microPhoneEle) {
                                      _microPhoneEle.classList.remove("hide");
                                  }
                                  if(_ttsSpeakerEle) {
                                      _ttsSpeakerEle.classList.remove("hide");
                                  }
                              }
                          },
                          error: function (msg) {
                              console.log("Failed to fetch bot details.");
                          }
                      });
                  }
              }*/
        window.onbeforeunload = function () {
          if (
            chatInitialize &&
            $(chatInitialize.config.chatContainer).length > 0
          ) {
            chatInitialize.destroy();
            //return null;
          }
        };
        this.addListener = function (evtName, trgFunc) {
          if (!_eventQueue) {
            _eventQueue = {};
          }
          if (evtName && evtName.trim().length > 0) {
            if (!_eventQueue[evtName]) {
              _eventQueue[evtName] = [];
            }
            if (typeof trgFunc === "function") {
              _eventQueue[evtName].push(trgFunc);
            }
          }
        };
        this.removeListener = function (evtName) {
          if (_eventQueue && _eventQueue[evtName]) {
            delete _eventQueue[evtName];
          }
        };
  
        this.callListener = function (evtName, data) {
          if (_eventQueue && _eventQueue[evtName]) {
            for (var i = 0; i < _eventQueue[evtName].length; i++) {
              if (typeof _eventQueue[evtName][i] === "function") {
                _eventQueue[evtName][i].call(this, data);
              }
            }
          }
        };
        this.show = function (cfg) {
          if ($("body").find(".kore-chat-window").length > 0) {
            return false;
          }
          cfg.chatHistory = this.chatHistory;
          cfg.handleError = this.showError;
          if (cfg.widgetSDKInstace) {
            this.addWidgetEvents(cfg);
          }
          chatInitialize = new chatWindow(cfg);
          chatInitialize.customTemplateObj = new customTemplate(
            cfg,
            chatInitialize
          );
  
          return this;
        };
  
        this.addWidgetEvents = function (cfg) {
          if (cfg) {
            var wizSDK = cfg.widgetSDKInstace;
            wizSDK.events.onPostback = function (data) {
              $(".chatInputBox").text(data.payload);
              chatInitialize.sendMessage(
                $(".chatInputBox"),
                data.utterance,
                data
              );
            };
          }
        };
  
        this.setWidgetInstance = function (widgetSDKInstace) {
          if (widgetSDKInstace) {
            chatInitialize.config.widgetSDKInstace = widgetSDKInstace;
            this.addWidgetEvents(chatInitialize.config);
          }
        };
        this.destroy = function () {
          if (chatInitialize && chatInitialize.destroy) {
            _eventQueue = {};
            chatInitialize.destroy();
          }
          if (_ttsContext) {
            _ttsContext.close();
            _ttsContext = null;
          }
          window.removeEventListener("online", updateOnlineStatus);
          window.removeEventListener("offline", updateOnlineStatus);
        };
        this.initToken = function (options) {
          assertionToken = "bearer " + options.accessToken;
        };
  
        this.hideError = function () {
          $(".errorMsgBlock").removeClass("showError");
        };
        this.showError = function (response) {
          try {
            response = JSON.parse(response);
            if (response.errors && response.errors[0]) {
              $(".errorMsgBlock").text(response.errors[0].msg);
              $(".errorMsgBlock").addClass("showError");
            }
          } catch (e) {
            $(".errorMsgBlock").text(response);
            $(".errorMsgBlock").addClass("showError");
          }
        };
        this.botDetails = function (response, botInfo) {
          if (window.KoreAgentDesktop) {
            if (response && response.userInfo) {
              KoreAgentDesktop(response.userInfo.userId, response);
            } else {
              console.log(
                "AgentDesktop initialization - did not receive authResponse"
              );
            }
          }
          /* Remove hide class for tts and speech if sppech not enabled for this bot */
          /*setTimeout(function () {
                      fetchBotDetails(response,botInfo);
                  }, 50);*/
        };
        this.chatHistory = function (res) {
          chatInitialize.chatHistory.call(chatInitialize, res);
        };
        // chatWindow.prototype.chatHistory = function (res) {
        //     var me = this;
        //     if(res[2]==='historysync'){
        //         //setTimeout(function () {
        //             if (res && res[1] && res[1].messages.length > 0) {
        //                 res[1].messages.forEach(function (msgData, index) {
        //                     setTimeout(function () {
        //                         if (msgData.type === "outgoing" || msgData.type === "bot_response") {
        //                             //if ($('.kore-chat-window .chat-container li#' + msgData.messageId).length < 1) {
        //                                 msgData.fromHistorySync=true;
  
        //                                 try {
        //                                     msgData.message[0].cInfo.body = JSON.parse(msgData.message[0].cInfo.body);
        //                                     if (msgData.message[0].cInfo.body && msgData.message[0].cInfo.body.text) {
        //                                         msgData.message[0].cInfo.body = msgData.message[0].cInfo.body.text;
        //                                     }
        //                                     msgData.message[0].component = msgData.message[0].cInfo.body;
        //                                     if (msgData.message[0].component.payload.template_type === 'dropdown_template') {
        //                                         msgData.message[0].component.selectedValue=res[1].messages[index+1].message[0].cInfo.body;
        //                                     }
        //                                     if (msgData.message[0].component.payload.template_type === 'feedbackTemplate') {
        //                                         msgData.message[0].cInfo.body="Rate this chat session";
        //                                     }
        //                                     if(msgData.message[0].component && msgData.message[0].component.payload && (msgData.message[0].component.payload.videoUrl || msgData.message[0].component.payload.audioUrl)){
        //                                         msgData.message[0].cInfo.body = "";
        //                                     }
        //                                     me.renderMessage(msgData);
        //                                 } catch (e) {
        //                                     me.renderMessage(msgData);
        //                                 }
        //                             //}
        //                         }
        //                     }, index * 100);
        //                 });
        //             }
        //         //}, 4000);//sync history messages after sockeet messages gets into viewport
        //     }else  if (me.loadHistory) {
        //         me.historyLoading = true;
        //         if (res && res[1] && res[1].messages.length > 0) {
        //             $('.chat-container').hide();
        //             $('.historyLoadingDiv').addClass('showMsg');
        //             res[1].messages.forEach(function (msgData, index) {
        //                 setTimeout(function (messagesQueue) {
        //                     // try {
        //                     //     msgData.message[0].cInfo.body = JSON.parse(msgData.message[0].cInfo.body);
        //                     //     msgData.message[0].component = msgData.message[0].cInfo.body;
        //                     //     me.renderMessage(msgData);
        //                     // } catch (e) {
        //                     //     me.renderMessage(msgData);
        //                     // }
        //                     var _ignoreMsgs = messagesQueue.filter(function (queMsg) {
        //                         return queMsg.messageId === msgData.messageId;
        //                     });
        //                     //dont show the the history message if we already have same message came from socket connect
        //                     if (!_ignoreMsgs.length) {
        //                         try {
        //                             msgData.message[0].cInfo.body = JSON.parse(msgData.message[0].cInfo.body);
        //                             if (msgData.message[0].cInfo.body && msgData.message[0].cInfo.body.text) {
        //                                 msgData.message[0].cInfo.body = msgData.message[0].cInfo.body.text;
        //                             }
        //                             msgData.message[0].component = msgData.message[0].cInfo.body;
        //                             if (msgData.message[0].component.payload.template_type === 'dropdown_template') {
        //                                 msgData.message[0].component.payload.fromHistory = true;
        //                                 msgData.message[0].component.selectedValue=res[1].messages[index+1].message[0].cInfo.body;
        //                             }
        //                             if (msgData.message[0].component.payload.template_type === 'multi_select' || msgData.message[0].component.payload.template_type === 'advanced_multi_select') {
        //                                 msgData.message[0].component.payload.fromHistory = true;
        //                             }
        //                             if (msgData.message[0].component.payload.template_type === 'form_template') {
        //                                 msgData.message[0].component.payload.fromHistory = true;
        //                             }
        //                             if (msgData.message[0].component.payload.template_type === 'tableList') {
        //                                 msgData.message[0].component.payload.fromHistory = true;
        //                             }
        //                             if (msgData.message[0].component.payload.template_type === 'listView') {
        //                                 msgData.message[0].component.payload.fromHistory = true;
        //                             }
        //                             if (msgData.message[0].component.payload.template_type === 'List') {
        //                                 msgData.message[0].component.payload.fromHistory = true;
        //                             }
        //                             if (msgData.message[0].component.payload.template_type === 'feedbackTemplate') {
        //                                 msgData.message[0].component.payload.fromHistory = true;
        //                                 msgData.message[0].cInfo.body="Rate this chat session";
        //                             }
        //                                                                     if(msgData.message[0].component && msgData.message[0].component.payload && (msgData.message[0].component.payload.videoUrl || msgData.message[0].component.payload.audioUrl)){
        //                                 msgData.message[0].cInfo.body = "";
        //                             }
        //                             me.renderMessage(msgData);
        //                         } catch (e) {
        //                             me.renderMessage(msgData);
        //                         }
        //                     }
        //                     if (index === res[1].messages.length - 1) {
        //                         setTimeout(function (messagesQueue) {
        //                             $('.chat-container').show();
        //                             $('.chat-container').animate({
        //                                 scrollTop: $('.chat-container').prop("scrollHeight")
        //                             }, 2500);
        //                             $('.historyLoadingDiv').removeClass('showMsg');
        //                             if(!me.config.botOptions.maintainContext){
        //                                 $('.chat-container').append("<div class='endChatContainer' aria-live='off' aria-hidden='true' ><span class='endChatContainerText'>"+botMessages.endofchat+"</span></div>");
        //                             }
        //                             if(messagesQueue.length){
        //                                 messagesQueue.forEach(function(msg, currIndex){
        //                                     me.renderMessage(msg);
        //                                     if(messagesQueue.length-1 ===  currIndex) {
        //                                         messagesQueue = [];
        //                                         me.historyLoadingComplete();
        //                                     }
        //                                 });
        //                             }else{
        //                                 me.historyLoadingComplete();
        //                             }
  
        //                         },500,messagesQueue);
        //                     }
        //                 }, index * 100,messagesQueue);
        //             });
        //         }
        //         else {
        //            me.historyLoadingComplete();
        //         }
        //     }
        // }
        this.closeConversationSession = function () {
          if (chatInitialize) {
            chatInitialize.closeConversationSession();
          }
        };
        /*************************************       Microphone code      **********************************************/
        var final_transcript = "";
        var recognizing = false;
        var recognition = null;
        var prevStr = "";
        setTimeout(function () {
          if (
            chatInitialize &&
            chatInitialize.config &&
            chatInitialize.config.stt &&
            chatInitialize.config.stt.vendor === "google"
          ) {
            if (window.initGapi) {
              initGapi();
            } else {
              console.warn(
                "Please uncomment Google Speech files('speech/app.js','speech/key.js' and 'client_api.js' in index.html"
              );
            }
          }
        }, 2000);
        function isChrome() {
          var isChromium = window.chrome,
            winNav = window.navigator,
            vendorName = winNav.vendor,
            isOpera = winNav.userAgent.indexOf("OPR") > -1,
            isIEedge = winNav.userAgent.indexOf("Edge") > -1,
            isIOSChrome = winNav.userAgent.match("CriOS");
  
          if (isIOSChrome) {
            return true;
          } else if (
            isChromium !== null &&
            typeof isChromium !== "undefined" &&
            vendorName === "Google Inc." &&
            isOpera === false &&
            isIEedge === false
          ) {
            return true;
          } else {
            return false;
          }
        }
        chatWindow.prototype.unfreezeUIOnHistoryLoadingFail = function () {
          var me = this;
          setTimeout(
            function (me) {
              if (me.loadHistory) {
                $(".chatInputBox").focus();
                $(".disableFooter").removeClass("disableFooter");
                me.historyLoading = false;
              }
            },
            20000,
            me
          );
        };
        if ("webkitSpeechRecognition" in window && isChrome()) {
          recognition = new window.webkitSpeechRecognition();
          final_transcript = "";
          recognition.continuous = true;
          recognition.interimResults = true;
  
          recognition.onstart = function () {
            prevStr = "";
            recognizing = true;
            $(".recordingMicrophone").css("display", "block");
            $(".notRecordingMicrophone").css("display", "none");
          };
  
          recognition.onerror = function (event) {
            console.log(event.error);
            $(".recordingMicrophone").trigger("click");
            $(".recordingMicrophone").css("display", "none");
            $(".notRecordingMicrophone").css("display", "block");
          };
  
          recognition.onend = function () {
            recognizing = false;
            $(".recordingMicrophone").trigger("click");
            $(".recordingMicrophone").css("display", "none");
            $(".notRecordingMicrophone").css("display", "block");
          };
  
          recognition.onresult = function (event) {
            final_transcript = "";
            var interim_transcript = "";
            for (var i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
              } else {
                interim_transcript += event.results[i][0].transcript;
              }
            }
            final_transcript = capitalize(final_transcript);
            final_transcript = linebreak(final_transcript);
            interim_transcript = linebreak(interim_transcript);
            if (final_transcript !== "") {
              prevStr += final_transcript;
            }
            //console.log('Interm: ',interim_transcript);
            //console.log('final: ',final_transcript);
            if (recognizing) {
              $(".chatInputBox").html(prevStr + "" + interim_transcript);
              $(".sendButton").removeClass("disabled");
            }
  
            setTimeout(function () {
              setCaretEnd(document.getElementsByClassName("chatInputBox"));
              document.getElementsByClassName("chatInputBox")[0].scrollTop =
                document.getElementsByClassName("chatInputBox")[0].scrollHeight;
            }, 350);
          };
        }
  
        var two_line = /\n\n/g;
        var one_line = /\n/g;
        function linebreak(s) {
          return s.replace(two_line, "<p></p>").replace(one_line, "<br>");
        }
  
        function capitalize(s) {
          return s.replace(s.substr(0, 1), function (m) {
            return m.toUpperCase();
          });
        }
        function startGoogleWebKitRecognization() {
          if (recognizing) {
            recognition.stop();
            return;
          }
          final_transcript = "";
          recognition.lang = chatInitialize.config.stt.webapi.recognitionLanguage;
          recognition.start();
        }
        function startGoogleSpeech() {
          if (rec) {
            rec.record();
            $(".recordingMicrophone").css("display", "block");
            $(".notRecordingMicrophone").css("display", "none");
            console.log("recording...");
            intervalKey = setInterval(function () {
              rec.export16kMono(function (blob) {
                console.log(new Date());
                if (chatInitialize.config.stt.vendor === "google") {
                  sendBlobToSpeech(blob, "LINEAR16", 16000);
                } else {
                  socketSend(blob);
                }
                rec.clear();
              }, "audio/x-raw");
            }, 1000);
          }
        }
  
        function getSIDToken() {
          if (chatInitialize.config.stt.vendor === "azure") {
            if (recognizer != null) {
              RecognizerStop(SDK, recognizer);
            }
            recognizer = RecognizerSetup(
              SDK,
              chatInitialize.config.stt.azure.recognitionMode,
              chatInitialize.config.stt.azure.recognitionLanguage,
              0,
              chatInitialize.stt.azure.subscriptionKey
            );
            RecognizerStart(SDK, recognizer);
          } else if (chatInitialize.config.stt.vendor === "google") {
            // using google cloud speech API
            micEnable();
          } else if (chatInitialize.config.stt.vendor === "webapi") {
            // using webkit speech recognition
            startGoogleWebKitRecognization();
          }
        }
        function micEnable() {
          if (isRecordingStarted) {
            return;
          }
          if (!navigator.getUserMedia) {
            navigator.getUserMedia =
              navigator.getUserMedia ||
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.msGetUserMedia;
          }
          if (navigator.getUserMedia) {
            isRecordingStarted = true;
            navigator.getUserMedia(
              {
                audio: true,
              },
              success,
              function (e) {
                isRecordingStarted = false;
                alert("Please enable the microphone permission for this page");
                return;
              }
            );
          } else {
            isRecordingStarted = false;
            alert("getUserMedia is not supported in this browser.");
          }
        }
  
        function afterMicEnable() {
          if (navigator.getUserMedia) {
            if (!rec) {
              isRecordingStarted = false;
              console.error("Recorder undefined");
              return;
            }
            if (_connection) {
              cancel();
            }
            try {
              _connection = createSocket();
            } catch (e) {
              isRecordingStarted = false;
              console.log(e);
              console.error("Web socket not supported in the browser");
            }
          }
        }
  
        function success(e) {
          isListening = true;
          mediaStream = e;
          if (!context) {
            var Context = window.AudioContext || window.webkitAudioContext;
            context = new Context();
          }
          mediaStreamSource = context.createMediaStreamSource(mediaStream);
          window.userSpeechAnalyser = context.createAnalyser();
          mediaStreamSource.connect(window.userSpeechAnalyser);
          console.log("Mediastream created");
          if (_connection) {
            _connection.close();
            _connection = null;
          }
          if (rec) {
            rec.stop();
            rec.clear();
            //rec.destroy();
            rec = null;
          }
          rec = new Recorder(mediaStreamSource, {
            workerPath: recorderWorkerPath,
          });
          console.log("Recorder Initialized");
          _permission = true;
          if (chatInitialize.config.stt.vendor === "google") {
            // afterMicEnable();
            startGoogleSpeech();
          }
          setTimeout(function () {
            setCaretEnd(document.getElementsByClassName("chatInputBox"));
          }, 600);
        }
  
        function cancel() {
          // Stop the regular sending of audio (if present) and disconnect microphone
          clearInterval(intervalKey);
          isRecordingStarted = false;
          if ($(".recordingMicrophone")) {
            $(".recordingMicrophone").css("display", "none");
          }
          if ($(".notRecordingMicrophone")) {
            $(".notRecordingMicrophone").css("display", "block");
          }
          if (
            mediaStream !== null &&
            mediaStream &&
            mediaStream.getTracks()[0].enabled
          ) {
            var track = mediaStream.getTracks()[0];
            track.stop();
          }
          if (_connection) {
            _connection.close();
            _connection = null;
          }
          if (rec) {
            rec.stop();
            rec.clear();
          }
          sidToken = "";
        }
  
        function socketSend(item) {
          if (_connection) {
            var state = _connection.readyState;
            if (state === 1) {
              if (item instanceof Blob) {
                if (item.size > 0) {
                  _connection.send(item);
                  //console.log('Send: blob: ' + item.type + ', ' + item.size);
                } else {
                  //console.log('Send: blob: ' + item.type + ', ' + item.size);
                }
              } else {
                console.log(item);
                _connection.send(item);
                //console.log('send tag: '+ item);
              }
            } else {
              isRecordingStarted = false;
              console.error(
                "Web Socket readyState != 1: ",
                state,
                "failed to send :" + item.type + ", " + item.size
              );
              cancel();
            }
          } else {
            isRecordingStarted = false;
            //console.error('No web socket connection: failed to send: ', item);
          }
        }
  
        function createSocket() {
          window.ENABLE_MICROPHONE = true;
          window.SPEECH_SERVER_SOCKET_URL = sidToken;
          var serv_url = window.SPEECH_SERVER_SOCKET_URL;
          var userEmail = userIdentity;
          window.WebSocket = window.WebSocket || window.MozWebSocket;
          var url = serv_url + "&" + CONTENT_TYPE + "&email=" + userEmail;
          var _connection = new WebSocket(url);
          // User is connected to server
          _connection.onopen = function (e) {
            console.log("User connected");
            _user_connection = true;
            rec.record();
            $(".recordingMicrophone").css("display", "block");
            $(".notRecordingMicrophone").css("display", "none");
            console.log("recording...");
            prevStr = "";
            intervalKey = setInterval(function () {
              rec.export16kMono(function (blob) {
                socketSend(blob);
                rec.clear();
              }, "audio/x-raw");
            }, INTERVAL);
          };
          // On receving message from server
          _connection.onmessage = function (msg) {
            var data = msg.data;
            var interim_transcript = "";
            //console.log(data);
            if (data instanceof Object && !(data instanceof Blob)) {
              console.log("Got object that is not a blob");
            } else if (data instanceof Blob) {
              console.log("Got Blob");
            } else {
              var res = JSON.parse(data);
              if (isListening && res.status === 0) {
                interim_transcript = res.result.hypotheses[0].transcript;
                if (res.result.final) {
                  prevStr += res.result.hypotheses[0].transcript + " ";
                  interim_transcript = "";
                }
  
                console.log("Interm: ", interim_transcript);
                console.log("final: ", prevStr);
                $(".chatInputBox").html(prevStr + "" + interim_transcript);
                setTimeout(function () {
                  setCaretEnd(document.getElementsByClassName("chatInputBox"));
                  document.getElementsByClassName("chatInputBox")[0].scrollTop =
                    document.getElementsByClassName(
                      "chatInputBox"
                    )[0].scrollHeight;
                }, 350);
                /*if (res.result.final) {
                                  var final_result = res.result.hypotheses[0].transcript;
                                  $('.chatInputBox').html($('.chatInputBox').html() + ' ' + final_result);
                                  setTimeout(function () {
                                      setCaretEnd(document.getElementsByClassName("chatInputBox"));
                                      document.getElementsByClassName('chatInputBox')[0].scrollTop = document.getElementsByClassName('chatInputBox')[0].scrollHeight;
                                  }, 350);
                              } else {
                                  //$('.chatInputBox').html($('.chatInputBox').html() + ' '+ res.result.hypotheses[0].transcript);
                                  console.log('Not final: ', res.result.hypotheses[0].transcript);
                              }*/
              } else {
                console.log("Server error : ", res.status);
              }
            }
          };
          // If server is closed
          _connection.onclose = function (e) {
            if (
              $(".chatInputBox").text() !== "" &&
              chatInitialize.config.autoEnableSpeechAndTTS
            ) {
              var me = window.chatContainerConfig;
              me.sendMessage($(".chatInputBox"));
            }
            isRecordingStarted = false;
            console.log("Server is closed");
            console.log(e);
            cancel();
          };
          // If there is an error while sending or receving data
          _connection.onerror = function (e) {
            console.log("Error : ", e);
          };
          return _connection;
        }
  
        function stop() {
          if (
            $(".chatInputBox").text() !== "" &&
            chatInitialize.config.autoEnableSpeechAndTTS
          ) {
            var me = window.chatContainerConfig;
            me.sendMessage($(".chatInputBox"));
          }
          clearInterval(intervalKey);
          $(".recordingMicrophone").css("display", "none");
          $(".notRecordingMicrophone").css("display", "block");
          if (rec) {
            rec.stop();
            isListening = false;
            console.log("stopped recording..");
            setTimeout(function () {
              if (_connection) {
                _connection.close();
                _connection = null;
              }
            }, 1000); // waiting to send and receive last message
  
            rec.export16kMono(function (blob) {
              socketSend(blob);
              rec.clear();
              if (_connection) {
                _connection.close();
              }
              var track = mediaStream.getTracks()[0];
              track.stop();
              //rec.destroy();
              isRecordingStarted = false;
            }, "audio/x-raw");
          } else {
            console.error("Recorder undefined");
          }
          if (recognizing) {
            recognition.stop();
            recognizing = false;
          }
        }
  
        $(window).on("beforeunload", function () {
          cancel();
        });
  
        /*************************************    Microphone code end here    **************************************/
  
        /*************************************    TTS code start here         **************************************/
  
        chatWindow.prototype.speakWithWebAPI = function (_txtToSpeak) {
          if (!_txtToSpeak) {
            return false;
          }
          if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            // Create a new instance of SpeechSynthesisUtterance.
            var msg = new SpeechSynthesisUtterance();
            msg.text = _txtToSpeak;
            //  msg.voice = speechSynthesis.getVoices().filter(function(voice) {
            //      return voice.default===true;
            //     })[0];
            // Queue this utterance.
            window.speechSynthesis.speak(msg);
          } else {
            console.warn(
              "KORE:Your browser doesn't support TTS(Speech Synthesiser)"
            );
          }
        };
        chatWindow.prototype.stopSpeaking = function () {
          var me = this;
          if (me.config.isTTSEnabled) {
            if (me.config.ttsInterface && me.config.ttsInterface === "webapi") {
              if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
              }
            }
          }
        };
        function createSocketForTTS() {
          if (!ttsServerUrl) {
            console.warn("Please provide tts socket url");
            return false;
          }
          window.TTS_SOCKET_URL = ttsServerUrl;
          var serv_url = window.TTS_SOCKET_URL;
          var userEmail = userIdentity;
          window.WebSocket = window.WebSocket || window.MozWebSocket;
          var _ttsConnection = new WebSocket(serv_url);
          _ttsConnection.binaryType = "arraybuffer";
          // User is connected to server
          _ttsConnection.onopen = function (e) {
            socketSendTTSMessage(_txtToSpeak);
          };
          // On receving message from server
          _ttsConnection.onmessage = function (msg) {
            _txtToSpeak = "";
            if (typeof msg.data === "string") {
              // do nothing
            } else {
              var _data = msg.data;
              if (chatInitialize.isTTSOn) {
                playsound(_data);
              }
            }
          };
          // If server is closed
          _ttsConnection.onclose = function (e) {
            //tts socket closed
          };
          // If there is an error while sending or receving data
          _ttsConnection.onerror = function (e) {
            console.log("Error : ", e);
          };
          return _ttsConnection;
        }
  
        function cancelTTSConnection() {
          if (_ttsConnection) {
            _ttsConnection.close();
            _ttsConnection = null;
          }
        }
        function socketSendTTSMessage(item) {
          if (_ttsConnection) {
            var state = _ttsConnection.readyState;
            if (state === 1) {
              var auth = bearerToken ? bearerToken : assertionToken;
              var _message = {
                message: item,
                user: _botInfo.name,
                authorization: auth,
              };
              _ttsConnection.send(JSON.stringify(_message));
            } else {
              console.error("Web Socket readyState != 1: ", state);
              cancelTTSConnection();
            }
          } else {
            console.error("No web socket connection: failed to send");
          }
        }
        function initTTSAudioContext() {
          if (!_ttsContext) {
            if (!window.AudioContext) {
              if (!window.webkitAudioContext) {
                console.error(
                  "Your browser does not support any AudioContext and cannot play back this audio."
                );
                return;
              }
              window.AudioContext = window.webkitAudioContext;
            }
            _ttsContext = new AudioContext();
          }
        }
        initTTSAudioContext();
        function playsound(raw) {
          _ttsContext.decodeAudioData(
            raw,
            function (buffer) {
              if (!buffer) {
                console.error("failed to decode:", "buffer null");
                return;
              }
              try {
                if (ttsAudioSource) {
                  ttsAudioSource.stop();
                }
                ttsAudioSource = _ttsContext.createBufferSource();
                ttsAudioSource.buffer = buffer;
                ttsAudioSource.connect(_ttsContext.destination);
                ttsAudioSource.start(0);
                ttsAudioSource.addEventListener("ended", function () {
                  setTimeout(function () {
                    if (
                      chatInitialize.isTTSOn &&
                      chatInitialize.config.autoEnableSpeechAndTTS
                    ) {
                      $(".notRecordingMicrophone").trigger("click");
                    }
                  }, 350);
                });
              } catch (e) {}
            },
            function (error) {
              console.error("failed to decode:", error);
            }
          );
        }
        /******************************** TTS code end here **********************************************/
        /*******************************    Function for Attachment ***********************************************/
  
        chatWindow.prototype.makeDroppable = function (element, callback) {
          var input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("multiple", false);
          input.style.display = "none";
  
          input.addEventListener("change", triggerCallback);
          element.appendChild(input);
  
          element.addEventListener("dragover", function (e) {
            e.preventDefault();
            e.stopPropagation();
            element.classList.add("dragover");
          });
  
          element.addEventListener("dragleave", function (e) {
            e.preventDefault();
            e.stopPropagation();
            element.classList.remove("dragover");
          });
  
          element.addEventListener("drop", function (e) {
            e.preventDefault();
            e.stopPropagation();
            element.classList.remove("dragover");
            triggerCallback(e);
          });
  
          /*element.addEventListener('click', function() {
                    input.value = null;
                    input.click();
                  });*/
  
          function triggerCallback(e) {
            var files;
            if (e.dataTransfer) {
              files = e.dataTransfer.files;
            } else if (e.target) {
              files = e.target.files;
            }
            callback.call(null, files);
          }
        };
        function cnvertFiles(_this, _file, customFileName) {
          var _scope = _this,
            recState = {};
          if (_file && _file.size) {
            if (_file.size > filetypes.file.limit.size) {
              alert(filetypes.file.limit.msg);
              return;
            }
          }
          if (_file && customFileName) {
            _file.name = customFileName;
          }
          if (_file && (_file.name || customFileName)) {
            var _fileName = customFileName || _file.name;
            var fileType = _fileName.split(".").pop().toLowerCase();
            recState.name = _fileName;
            recState.mediaName = getUID();
            recState.fileType = _fileName.split(".").pop().toLowerCase();
            var uploadFn;
            if (filetypes.image.indexOf(recState.fileType) > -1) {
              recState.type = "image";
              recState.uploadFn = "acceptFileRecording";
            } else if (filetypes.video.indexOf(recState.fileType) > -1) {
              recState.type = "video";
              recState.uploadFn = "acceptVideoRecording";
            } else if (filetypes.audio.indexOf(recState.fileType) > -1) {
              recState.type = "audio";
              recState.uploadFn = "acceptFile";
            } else {
              recState.type = "attachment";
              recState.componentSize = _file.size;
              recState.uploadFn = "acceptFile";
            }
            if (allowedFileTypes && allowedFileTypes.indexOf(fileType) !== -1) {
              if (recState.type === "audio" || recState.type === "video") {
                //read duration;
                var rd = new FileReader();
                rd.onload = function (e) {
                  var blob = new Blob([e.target.result], { type: _file.type }), // create a blob of buffer
                    url = (URL || webkitURL).createObjectURL(blob), // create o-URL of blob
                    video = document.createElement(recState.type); // create video element
                  video.preload = "metadata"; // preload setting
                  if (video.readyState === 0) {
                    video.addEventListener("loadedmetadata", function (evt) {
                      // whenshow duration
                      var _dur = Math.round(evt.target.duration);
                      if (recState.type === "audio") {
                        (URL || webkitURL).revokeObjectURL(url); //fallback for webkit
                        getFileToken(_this, _file, recState);
                      }
                    });
                    if (recState.type === "video") {
                      video.addEventListener("loadeddata", function (e) {
                        recState.resulttype = getDataURL(video);
                        (URL || webkitURL).revokeObjectURL(url); //fallback for webkit
                        getFileToken(_this, _file, recState);
                      });
                    }
                    video.src = url; // start video load
                  } else {
                    (URL || webkitURL).revokeObjectURL(url); //fallback for webkit
                    getFileToken(_this, _file, recState);
                  }
                };
                rd.readAsArrayBuffer(_file);
              } else {
                if (_file.type.indexOf("image") !== -1) {
                  var imgRd = new FileReader();
                  imgRd.onload = function (e) {
                    var blob = new Blob([e.target.result], { type: _file.type }), // create a blob of buffer
                      url = (URL || webkitURL).createObjectURL(blob); // create o-URL of blob
                    var img = new Image();
                    img.src = url;
                    img.onload = function () {
                      recState.resulttype = getDataURL(img);
                      getFileToken(_this, _file, recState);
                    };
                  };
                  imgRd.readAsArrayBuffer(_file);
                } else {
                  getFileToken(_this, _file, recState);
                }
              }
            } else {
              alert("SDK not supported this type of file");
            }
          }
        }
        function getUID(pattern) {
          var _pattern = pattern || "xxxxyx";
          _pattern = _pattern.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
              v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
          return _pattern;
        }
        function getDataURL(src) {
          var thecanvas = document.createElement("canvas");
          thecanvas.height = 180;
          thecanvas.width = 320;
  
          var context = thecanvas.getContext("2d");
          context.drawImage(src, 0, 0, thecanvas.width, thecanvas.height);
          var dataURL = thecanvas.toDataURL();
          return dataURL;
        }
        function acceptAndUploadFile(_this, file, recState) {
          var _scope = _this,
            ele;
          var uc = getfileuploadConf(recState);
          uc.chunkUpload = file.size > appConsts.CHUNK_SIZE;
          uc.chunkSize = appConsts.CHUNK_SIZE;
          uc.file = file;
          if (uc.chunkUpload) {
            notifyFlie(_scope, recState);
            ele = $(".chatInputBox");
            initiateRcorder(recState, ele);
            ele.uploader(uc);
          } else {
            var reader = new FileReader();
            reader.onloadend = function (evt) {
              if (evt.target.readyState === FileReader.DONE) {
                // DONE == 2
                var converted = reader.result.replace(/^.*;base64,/, "");
                var relt = reader.result;
                var resultGet = converted;
                recState.resulttype = resultGet;
                acceptFileRecording(_scope, recState, ele);
              }
            };
            reader.readAsDataURL(file);
          }
        }
        function getFileToken(_obj, _file, recState) {
          var me = chatInitialize;
          var auth = bearerToken ? bearerToken : assertionToken;
          var url = koreAPIUrl + "1.1/attachment/file/token";
          if (
            me.config &&
            me.config &&
            me.config.botOptions &&
            me.config.botOptions.webhookConfig &&
            me.config.botOptions.webhookConfig.enable
          ) {
            url =
              koreAPIUrl +
              "attachments/" +
              me.config.botOptions.webhookConfig.streamId +
              "/" +
              me.config.botOptions.webhookConfig.channelType +
              "/token";
            auth = "bearer " + me.config.botOptions.webhookConfig.token;
          }
          $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            headers: {
              Authorization: auth,
            },
            success: function (response) {
              fileToken = response.fileToken;
              acceptAndUploadFile(_obj, _file, recState);
            },
            error: function (msg) {
              chatInitialize.config.botOptions._reconnecting = true;
              _self.showError("Failed to upload file.Please try again");
              if (
                msg.responseJSON &&
                msg.responseJSON.errors &&
                msg.responseJSON.errors.length &&
                msg.responseJSON.errors[0].httpStatus === "401"
              ) {
                setTimeout(function () {
                  _self.hideError();
                }, 5000);
                $(".kore-chat-window .reload-btn").trigger("click");
              }
              console.log("Oops, something went horribly wrong");
            },
          });
        }
        function getfileuploadConf(_recState) {
          var me = chatInitialize;
          appConsts.UPLOAD = {
            FILE_ENDPOINT: koreAPIUrl + "1.1/attachment/file",
            FILE_TOKEN_ENDPOINT: koreAPIUrl + "1.1/attachment/file/token",
            FILE_CHUNK_ENDPOINT: koreAPIUrl + "1.1/attachment/file/:fileID/chunk",
          };
          _accessToke = "bearer " + chatInitialize.accessToken;
          if (
            me.config &&
            me.config &&
            me.config.botOptions &&
            me.config.botOptions.webhookConfig &&
            me.config.botOptions.webhookConfig.enable
          ) {
            //appConsts.UPLOAD.FILE_ENDPOINT=koreAPIUrl + "attachments/file/"+me.config.botOptions.webhookConfig.streamId+"/"+me.config.botOptions.webhookConfig.channelType;
            _accessToke = "bearer " + me.config.botOptions.webhookConfig.token;
            appConsts.UPLOAD = {
              FILE_ENDPOINT:
                koreAPIUrl +
                "attachments/file/" +
                me.config.botOptions.webhookConfig.streamId +
                "/" +
                me.config.botOptions.webhookConfig.channelType,
              FILE_TOKEN_ENDPOINT:
                koreAPIUrl +
                "attachments/" +
                me.config.botOptions.webhookConfig.streamId +
                "/" +
                me.config.botOptions.webhookConfig.channelType +
                "/token",
              FILE_CHUNK_ENDPOINT:
                koreAPIUrl +
                "attachments/" +
                me.config.botOptions.webhookConfig.streamId +
                "/" +
                me.config.botOptions.webhookConfig.channelType +
                "/token/:fileID/chunk",
            };
          }
          _uploadConfg = {};
          _uploadConfg.url = appConsts.UPLOAD.FILE_ENDPOINT.replace(
            ":fileID",
            fileToken
          );
          _uploadConfg.tokenUrl = appConsts.UPLOAD.FILE_TOKEN_ENDPOINT;
          _uploadConfg.chunkUrl = appConsts.UPLOAD.FILE_CHUNK_ENDPOINT.replace(
            ":fileID",
            fileToken
          );
          _uploadConfg.fieldName = "file";
          _uploadConfg.data = {
            fileExtension: _recState.fileType,
            fileContext: "workflows",
            thumbnailUpload: false,
            filename: _recState.name,
          };
          _uploadConfg.headers = {
            Authorization: _accessToke,
          };
          return _uploadConfg;
        }
        function notifyFlie(_this, _recState, _tofileId) {
          var _this = _this;
          var _data = {};
          _data.meta = {
            thumbNail: _recState.resulttype ? _recState.resulttype : undefined,
          };
          _data.values = {
            componentId: _recState.mediaName,
            componentType: _recState.type,
            componentFileId: _tofileId,
            componentData: {
              filename: _recState.name,
            },
          };
          if (_recState.componentSize) {
            _data.values.componentSize = _recState.componentSize;
          }
          onComponentReady(_this, _data);
        }
        function initiateRcorder(_recState, ele) {
          var _scope = this;
          ele = ele || _scope.ele;
          ele.on("success.ke.uploader", function (e) {
            onFileToUploaded(_scope, e, _recState);
          });
          ele.on("error.ke.uploader", onUploadError);
        }
        function onFileToUploaded(_this, evt, _recState) {
          var _this = _this;
          var _data = evt.params;
          if (!_data || !_data.fileId) {
            onError();
            return;
          }
          if (_recState.mediaName) {
            var _tofileId = _data.fileId;
            notifyfileCmpntRdy(_this, _recState, _tofileId);
          }
        }
        function onUploadError(_this, evt, _recState) {
          var _scope = _this;
          _recfileLisnr.onError({
            code: "UPLOAD_FAILED",
          });
          _scope.removeCmpt(_recState);
        }
        function onError() {
          alert("Failed to upload content. Try again");
          attachmentInfo = {};
          $(".attachment").html("");
          $(".sendButton").addClass("disabled");
          fileUploaderCounter = 0;
        }
        function onComponentReady(_this, data) {
          var _this = _this,
            _src,
            _imgCntr,
            _img,
            base64Matcher,
            http,
            _cmptVal,
            _cmpt;
          if (!_cmpt) {
            _cmpt = $("<div/>").attr({
              class:
                "msgCmpt " +
                data.values.componentType +
                " " +
                data.values.componentId,
            });
            _cmpt.data("value", data.values);
  
            if (
              !data.values.componentFileId &&
              data.values.componentType !== "contact" &&
              data.values.componentType !== "location" &&
              data.values.componentType !== "filelink" &&
              data.values.componentType !== "alert" &&
              data.values.componentType !== "email"
            ) {
              _cmpt.append('<div class="upldIndc"></div>');
            }
            if (data.values.componentType === "attachment") {
              var fileType, _fn;
              if (data.values.componentDescription) {
                fileType = data.values.componentDescription
                  .split(".")
                  .pop()
                  .toLowerCase();
              } else {
                fileType = data.values.componentData.filename
                  .split(".")
                  .pop()
                  .toLowerCase();
              }
              if (fileType === "xls" || fileType === "xlsx") {
                _cmpt.append(
                  '<div class="uploadedFileIcon"><span class="icon cf-icon icon-files_excel"></span></div>'
                );
                _cmpt.append(
                  '<div class="uploadedFileName">' +
                    data.values.componentData.filename +
                    "</div>"
                );
              } else if (fileType === "docx" || fileType === "doc") {
                _cmpt.append(
                  '<div class="uploadedFileIcon"><span class="icon cf-icon icon-files_word"></span></div>'
                );
                _cmpt.append(
                  '<div class="uploadedFileName">' +
                    data.values.componentData.filename +
                    "</div>"
                );
              } else if (fileType === "pdf") {
                _cmpt.append(
                  '<div class="uploadedFileIcon"><span class="icon cf-icon icon-files_pdf"></span></div>'
                );
                _cmpt.append(
                  '<div class="uploadedFileName">' +
                    data.values.componentData.filename +
                    "</div>"
                );
              } else if (
                fileType === "ppsx" ||
                fileType === "pptx" ||
                fileType === "ppt"
              ) {
                _cmpt.append(
                  '<div class="uploadedFileIcon"><span class="icon cf-icon icon-files_ppt"></span></div>'
                );
                _cmpt.append(
                  '<div class="uploadedFileName">' +
                    data.values.componentData.filename +
                    "</div>"
                );
              } else if (fileType === "zip" || fileType === "rar") {
                _cmpt.append(
                  '<div class="uploadedFileIcon"><span class="icon cf-icon icon-files_zip"></span></div>'
                );
                _cmpt.append(
                  '<div class="uploadedFileName">' +
                    data.values.componentData.filename +
                    "</div>"
                );
              } else {
                _cmpt.append(
                  '<div class="uploadedFileIcon"><span class="icon cf-icon icon-files_other_doc"></span></div>'
                );
                _cmpt.append(
                  '<div class="uploadedFileName">' +
                    data.values.componentData.filename +
                    "</div>"
                );
              }
            }
            if (data.values.componentType === "image") {
              _cmpt.append(
                '<div class="uploadedFileIcon"><span class="icon cf-icon icon-photos_active"></span></div>'
              );
              _cmpt.append(
                '<div class="uploadedFileName">' +
                  data.values.componentData.filename +
                  "</div>"
              );
            }
            if (data.values.componentType === "audio") {
              _cmpt.append(
                '<div class="uploadedFileIcon"><span class="icon cf-icon icon-files_audio"></span></div>'
              );
              _cmpt.append(
                '<div class="uploadedFileName">' +
                  data.values.componentData.filename +
                  "</div>"
              );
            }
            if (data.values.componentType === "video") {
              _cmpt.append(
                '<div class="uploadedFileIcon"><span class="icon cf-icon icon-video_active"></span></div>'
              );
              _cmpt.append(
                '<div class="uploadedFileName">' +
                  data.values.componentData.filename +
                  "</div>"
              );
            }
          }
          _cmpt.append(
            '<div class="removeAttachment"><span>&times;</span></div>'
          );
          $(".footerContainer").find(".attachment").html(_cmpt);
          $(".chatInputBox").focus();
          chatInitialize.attachmentInfo.fileName =
            data.values.componentData.filename;
          chatInitialize.attachmentInfo.fileType = data.values.componentType;
          $(".sendButton").removeClass("disabled");
        }
        function acceptFileRecording(_this, _recState, ele) {
          var _scope = _this;
          var _uc = getfileuploadConf(_recState),
            _imageCntn = _recState.resulttype;
          notifyfileCmpntRdy(_scope, _recState);
          _uc.data[_uc.fieldName] = {
            fileName: _recState.name,
            data: _imageCntn,
            type: "image/png",
          };
          _uc.data.thumbnail = {
            fileName: _recState.name + "_thumb",
            data: _imageCntn,
            type: "image/png",
          };
          ele = $(".chatInputBox");
          initiateRcorder(_recState, ele);
          ele.uploader(_uc);
        }
        function notifyfileCmpntRdy(_this, _recState, _tofileId) {
          var _this = _this;
          var _data = {};
          _data.meta = {
            thumbNail: _recState.resulttype,
          };
          _data.values = {
            componentId: _recState.mediaName,
            componentType: _recState.type,
            componentFileId: _tofileId,
            componentData: {
              filename: _recState.name,
            },
          };
          onComponentReady(_this, _data);
        }
        /***************************************************** ke.uploader file code **********************************************/
        function MultipartData() {
          this.boundary = "--------MultipartData" + Math.random();
          this._fields = [];
        }
        MultipartData.prototype.append = function (key, value) {
          this._fields.push([key, value]);
        };
        MultipartData.prototype.toString = function () {
          var boundary = this.boundary;
          var body = "";
          this._fields.forEach(function (field) {
            body += "--" + boundary + "\r\n";
            // file upload
            if (field[1].data) {
              var file = field[1];
              if (file.fileName) {
                body +=
                  'Content-Disposition: form-data; name="' +
                  field[0] +
                  '"; filename="' +
                  file.fileName +
                  '"';
              } else {
                body += 'Content-Disposition: form-data; name="' + field[0] + '"';
              }
              body += "\r\n";
              if (file.type) {
                body += "Content-Type: UTF-8; charset=ISO-8859-1\r\n";
              }
              body += "Content-Transfer-Encoding: base64\r\n";
              body += "\r\n" + file.data + "\r\n"; //base64 data
            } else {
              body +=
                'Content-Disposition: form-data; name="' +
                field[0] +
                '";\r\n\r\n';
              body += field[1] + "\r\n";
            }
          });
          body += "--" + boundary + "--";
          return body;
        };
        function Uploader(element, options) {
          this.options = options;
          this.$element = element;
          if (!this.options.chunkUpload) {
            startUpload(this);
          } else {
            startChunksUpload(this);
          }
        }
        var _cls = Uploader.prototype;
        _cls.events = {
          error: $.Event("error.ke.uploader"),
          progressChange: $.Event("progress.ke.uploader"),
          success: $.Event("success.ke.uploader"),
        };
        function getConnection(_this) {
          return new kfrm.net.HttpRequest();
        }
  
        function loadListener(_this, evt) {
          if ($(".upldIndc").is(":visible")) {
            _this.events.success.params = $.parseJSON(evt.target.response);
            attachmentInfo.fileId = _this.events.success.params.fileId;
            $(".sendButton").removeClass("disabled");
            $(".kore-chat-window").addClass("kore-chat-attachment");
            $(".chat-container").scrollTop(
              $(".chat-container").prop("scrollHeight")
            );
            fileUploaderCounter = 1;
            $(".upldIndc").remove();
            _this.$element.trigger(_this.events.success);
          }
        }
  
        function errorListener(_this, evt) {
          _this.events.error.params = evt;
          _this.$element.trigger(_this.events.error);
        }
  
        function progressListener(_this, evt) {}
  
        function setOptions(_this, opts) {
          _this.options = opts;
          return _this;
        }
  
        function commitFile(_this) {
          var _scope = _this,
            _conc = getConnection(_this),
            _mdat = new MultipartData();
          _conc.addEventListener(
            "load",
            function (evt) {
              if (evt.target.status === 200) {
                if (_scope.$element.parent().length) {
                  loadListener(_scope, evt);
                }
              } else {
                errorListener(_scope, evt);
              }
            },
            false
          );
          _conc.addEventListener(
            "error",
            function (evt) {
              errorListener(_scope, evt);
            },
            false
          );
          _conc.withCredentials = false;
          _conc.open("PUT", _this.options.chunkUrl.replace(/\/chunk/, ""));
  
          if (_this.options.headers) {
            for (var header in _this.options.headers) {
              _conc.setRequestHeader(header, _this.options.headers[header]);
            }
          }
          _mdat.append("totalChunks", _scope.totalChunks);
          _mdat.append("messageToken", _scope.messageToken);
          if (_this.options.data) {
            for (var key in _this.options.data) {
              _mdat.append(key, _this.options.data[key]);
            }
          }
          _conc.setRequestHeader(
            "Content-Type",
            "multipart/form-data; boundary=" + _mdat.boundary
          );
          _conc.send(_mdat.toString());
        }
  
        function uploadChunk(_this) {
          var _scope = _this,
            _conc = getConnection(_this),
            _mdat = new MultipartData();
          _conc.addEventListener(
            "load",
            function (evt) {
              if (evt.target.status === 200) {
                _scope.currChunk++;
                if (!_scope.$element.parent().length) {
                  return;
                } else if (_scope.currChunk === _scope.totalChunks) {
                  commitFile(_scope);
                } else {
                  initUploadChunk(_scope);
                }
              } else {
                errorListener(_scope, evt);
              }
            },
            false
          );
          _conc.addEventListener(
            "error",
            function (evt) {
              errorListener(_scope, evt);
            },
            false
          );
          _conc.withCredentials = false;
          _conc.open("POST", _this.options.chunkUrl);
  
          if (_this.options.headers) {
            for (var header in _this.options.headers) {
              _conc.setRequestHeader(header, _this.options.headers[header]);
            }
          }
          _mdat.append("chunkNo", _scope.currChunk);
          _mdat.append("messageToken", _scope.messageToken);
          _mdat.append("chunk", {
            data: _scope.chunk,
            fileName: _scope.options.file.name,
          });
          _conc.setRequestHeader(
            "Content-Type",
            "multipart/form-data; boundary=" + _mdat.boundary
          );
          _conc.send(_mdat.toString());
        }
  
        function initUploadChunk(_this) {
          var _scope = _this;
          var file = _scope.options.file;
          var start = _scope.options.chunkSize * _scope.currChunk;
          var stop =
            _scope.currChunk === _scope.totalChunks - 1
              ? file.size
              : (_scope.currChunk + 1) * _scope.options.chunkSize;
          var reader = new FileReader();
          var blob = file.slice(start, stop);
          reader.onloadend = function (evt) {
            if (
              evt.target.readyState === FileReader.DONE &&
              _scope.$element.parent().length
            ) {
              // DONE == 2
              var dataObj = evt.target.result;
              dataObj = dataObj.replace(/^.*;base64,/, "");
              dataObj = dataObj.replace(
                "data:application/octet-stream;base64,",
                ""
              );
              _scope.chunk = dataObj;
              if (
                _scope.currChunk < _scope.totalChunks &&
                _scope.$element.parent().length
              ) {
                uploadChunk(_scope);
              }
            } else {
              errorListener(_scope, evt);
            }
          };
          reader.readAsDataURL(blob);
        }
  
        function startChunksUpload(_this) {
          var _scope = _this,
            _conc = getConnection(_this);
          _conc.addEventListener(
            "error",
            function (evt) {
              errorListener(_scope, evt);
            },
            false
          );
          _conc.addEventListener(
            "load",
            function (evt) {
              if (evt.target.status === 200) {
                _scope.messageToken = JSON.parse(evt.target.response).fileToken;
                _scope.totalChunks =
                  Math.floor(
                    _scope.options.file.size / _scope.options.chunkSize
                  ) + 1;
                _scope.currChunk = 0;
                _scope.options.chunkUrl = _scope.options.chunkUrl.replace(
                  ":token",
                  _scope.messageToken
                );
                if (_scope.$element.parent().length) {
                  initUploadChunk(_scope);
                }
              } else {
                errorListener(_scope, evt);
              }
            },
            false
          );
          _conc.withCredentials = false;
          _conc.open("POST", _this.options.tokenUrl);
          if (_this.options.headers) {
            for (var header in _this.options.headers) {
              _conc.setRequestHeader(header, _this.options.headers[header]);
            }
          }
          _conc.send();
        }
        function startUpload(_this) {
          var _scope = _this;
          (_conc = getConnection(_this)), (_mdat = new MultipartData());
          if (_conc.upload && _conc.upload.addEventListener) {
            _conc.upload.addEventListener(
              "progress",
              function (evt) {
                progressListener(_scope, evt);
              },
              false
            );
          }
          _conc.addEventListener(
            "load",
            function (evt) {
              if (_scope.$element.parent().length) {
                loadListener(_scope, evt);
              }
            },
            false
          );
          _conc.addEventListener(
            "error",
            function (evt) {
              errorListener(_scope, evt);
            },
            false
          );
          _conc.withCredentials = false;
          _conc.open("POST", _this.options.url);
  
          if (_this.options.headers) {
            for (var header in _this.options.headers) {
              _conc.setRequestHeader(header, _this.options.headers[header]);
            }
          }
          if (_this.options.data) {
            for (var key in _this.options.data) {
              _mdat.append(key, _this.options.data[key]);
            }
          }
          _conc.setRequestHeader(
            "Content-Type",
            "multipart/form-data; boundary=" + _mdat.boundary
          );
          _conc.send(_mdat.toString());
        }
  
        function zoomChart() {
          var modal = document.getElementById("myPreviewModal");
          $(".largePreviewContent").empty();
          $(".largePreviewContent").addClass("addheight");
          $(".largePreviewContent").html("<div class='chartContainerDiv'></div>");
          modal.style.display = "block";
          // Get the <span> element that closes the modal
          var span = document.getElementsByClassName("closeElePreview")[0];
  
          // When the user clicks on <span> (x), close the modal
          span.onclick = function () {
            modal.style.display = "none";
            $(".largePreviewContent").removeClass("addheight");
          };
        }
  
        // Function to send chatbot state to the parent window
        function sendChatbotStateToParent(state, HostURLWhereIframeTobeEmbedded) {
          console.log(
            "## HostURLWhereIframeTobeEmbedded=",
            HostURLWhereIframeTobeEmbedded
          );
          // window.parent.postMessage(
          //   { chatbotState: state },
          //   HostURLWhereIframeTobeEmbedded
          // );
          const targetOrigins = HostURLWhereIframeTobeEmbedded;
          targetOrigins.forEach(origin => {
            window.parent.postMessage({ chatbotState: state }, origin);
          })
          // window.parent.postMessage({ chatbotState: state }, 'http://localhost:3002/' );
        }
  
        // Notify the parent when the chatbot is maximized
        function maximizeChatbot(botOptions) {
          // Send the chatbot maximized state to the parent
          sendChatbotStateToParent(
            "maximized",
            botOptions.HostURLWhereIframeTobeEmbedded
          );
        }
  
        // Notify the parent when the chatbot is minimized
        function minimizeChatbot(botOptions) {
          // Send the chatbot minimized state to the parent
          sendChatbotStateToParent(
            "minimized",
            botOptions.HostURLWhereIframeTobeEmbedded
          );
        }
  
        // listen to chart click
        function handleChartOnClick() {
          $(".piechartDiv,.barchartDiv, .linechartDiv").click(function (e) {
            var firstEleId = e.currentTarget.firstElementChild.getAttribute("id");
            //get chart data
            var chart = null;
            var data = null;
            var container = null;
            for (var i = 0; i < available_charts.length; i++) {
              if (available_charts[i].id == firstEleId) {
                data = jQuery.extend({}, available_charts[i]);
                zoomChart();
                break;
              }
            }
            if (graphLibGlob === "d3") {
              zoomChart();
              if (data.data.message[0].component.payload.pie_type === undefined) {
                data.data.message[0].component.payload.pie_type = "regular";
              }
              if (
                data.data.message[0].component.payload.template_type !==
                  "linechart" &&
                data.data.message[0].component.payload.template_type !==
                  "piechart"
              ) {
                var dimens = {};
                dimens.outerWidth = 650;
                dimens.outerHeight = 460;
                dimens.innerWidth = 450;
                dimens.innerHeight = 350;
                dimens.legendRectSize = 15;
                dimens.legendSpacing = 4;
                $(".chartContainerDiv").html("");
                if (
                  data.data.message[0].component.payload.template_type ===
                    "barchart" &&
                  data.data.message[0].component.payload.direction ===
                    "vertical" &&
                  data.type === "barchart"
                ) {
                  dimens.innerWidth = 500;
                  KoreGraphAdapter.drawD3barChart(
                    data.data,
                    dimens,
                    ".chartContainerDiv",
                    12
                  );
                } else if (
                  data.data.message[0].component.payload.template_type ===
                    "barchart" &&
                  data.data.message[0].component.payload.direction ===
                    "horizontal" &&
                  data.type === "stackedBarchart"
                ) {
                  KoreGraphAdapter.drawD3barStackedChart(
                    data.data,
                    dimens,
                    ".chartContainerDiv",
                    12
                  );
                } else if (
                  data.data.message[0].component.payload.template_type ===
                    "barchart" &&
                  data.data.message[0].component.payload.direction ===
                    "vertical" &&
                  data.type === "stackedBarchart"
                ) {
                  dimens.innerWidth = 550;
                  KoreGraphAdapter.drawD3barVerticalStackedChart(
                    data.data,
                    dimens,
                    ".chartContainerDiv",
                    12
                  );
                } else if (
                  data.data.message[0].component.payload.template_type ===
                    "barchart" &&
                  data.data.message[0].component.payload.direction ===
                    "horizontal" &&
                  data.type === "barchart"
                ) {
                  dimens.outerWidth = 650;
                  dimens.outerHeight = 350;
                  dimens.innerWidth = 450;
                  dimens.innerHeight = 310;
                  KoreGraphAdapter.drawD3barHorizontalbarChart(
                    data.data,
                    dimens,
                    ".chartContainerDiv",
                    12
                  );
                }
              } else if (
                data.data.message[0].component.payload.template_type ===
                "linechart"
              ) {
                var dimens = {};
                dimens.outerWidth = 650;
                dimens.outerHeight = 450;
                dimens.innerWidth = 480;
                dimens.innerHeight = 350;
                dimens.legendRectSize = 15;
                dimens.legendSpacing = 4;
                $(".chartContainerDiv").html("");
                //  KoreGraphAdapter.drawD3lineChart(data.data, dimens, '.chartContainerDiv', 12);
                KoreGraphAdapter.drawD3lineChartV2(
                  data.data,
                  dimens,
                  ".chartContainerDiv",
                  12
                );
              } else if (data.data.message[0].component.payload.pie_type) {
                var dimens = {};
                dimens.width = 600;
                dimens.height = 400;
                dimens.legendRectSize = 15;
                dimens.legendSpacing = 4;
                $("chartContainerDiv").html("");
                if (
                  data.data.message[0].component.payload.pie_type === "regular"
                ) {
                  KoreGraphAdapter.drawD3Pie(
                    data.data,
                    dimens,
                    ".chartContainerDiv",
                    16
                  );
                } else if (
                  data.data.message[0].component.payload.pie_type === "donut"
                ) {
                  KoreGraphAdapter.drawD3PieDonut(
                    data.data,
                    dimens,
                    ".chartContainerDiv",
                    16,
                    "donut"
                  );
                } else if (
                  data.data.message[0].component.payload.pie_type ===
                  "donut_legend"
                ) {
                  $("chartContainerDiv").html("");
                  KoreGraphAdapter.drawD3PieDonut(
                    data.data,
                    dimens,
                    ".chartContainerDiv",
                    16,
                    "donut_legend"
                  );
                }
              }
            } else if (graphLibGlob === "google") {
              if (data.type === "piechart") {
                google.charts.load("current", { packages: ["corechart"] });
                google.charts.setOnLoadCallback(drawChart);
                function drawChart() {
                  container =
                    document.getElementsByClassName("chartContainerDiv");
                  chart = new google.visualization.PieChart(container[0]);
                }
              } else if (data.type === "linechart") {
                google.charts.load("current", {
                  packages: ["corechart", "line"],
                });
                google.charts.setOnLoadCallback(drawChart);
                function drawChart() {
                  container =
                    document.getElementsByClassName("chartContainerDiv");
                  chart = new google.visualization.LineChart(container[0]);
                }
              } else if (data.type === "barchart") {
                google.charts.load("current", { packages: ["corechart", "bar"] });
                google.charts.setOnLoadCallback(drawChart);
                function drawChart() {
                  container =
                    document.getElementsByClassName("chartContainerDiv");
                  if (data.direction === "vertical") {
                    chart = new google.visualization.ColumnChart(container[0]);
                  } else {
                    chart = new google.visualization.BarChart(container[0]);
                  }
                }
              }
              setTimeout(function () {
                var chartAreaObj = { height: "85%", width: "85%" };
                data.options.chartArea = chartAreaObj;
                google.visualization.events.addListener(
                  chart,
                  "ready",
                  function () {
                    setTimeout(function () {
                      $(".largePreviewContent .chartContainerDiv").css(
                        "height",
                        "91%"
                      );
                    });
                  }
                );
                chart.draw(data.data, data.options);
              }, 200);
            }
          });
        }
        var old = $.fn.uploader;
  
        $.fn.uploader = function (option) {
          var _args = Array.prototype.slice.call(arguments, 1);
          return this.each(function () {
            var $this = $(this),
              data = ""; //$this.data('ke.uploader'),
            options = typeof option === "object" && option;
  
            if (!data) {
              $this.data("ke.uploader", (data = new Uploader($this, options)));
            } else if (option) {
              if (typeof option === "string" && data[option]) {
                data[option].apply(data, _args);
              } else if (options) {
                startUpload(setOptions(data, options));
              }
            }
            return option && data[option] && data[option].apply(data, _args);
          });
        };
  
        $.fn.uploader.Constructor = Uploader;
  
        $.fn.uploader.noConflict = function () {
          $.fn.uploader = old;
          return this;
        };
        /************************************************************************************************************************************************
         ********************************************** kore.ai framework file ******************************************************************************
         ************************************************************************************************************************************************/
        +(function () {
          function getHTTPConnecton() {
            var xhr = false;
            xhr = new XMLHttpRequest();
            if (xhr) {
              return xhr;
            } else if (typeof XDomainRequest !== "undefined") {
              return new XDomainRequest();
            }
            return xhr;
          }
  
          function HttpRequest() {
            var xhr = getHTTPConnecton();
            if (!xhr) {
              throw "Unsupported HTTP Connection";
            }
            try {
              xhr.withCredentials = true;
            } catch (e) {}
            xhr.onreadystatechange = function () {
              return xhr.onReadyStateChange && xhr.onReadyStateChange.call(xhr);
            };
            return xhr;
          }
          kfrm.net.HttpRequest = HttpRequest;
        })();
  
        return {
          initToken: initToken,
          addListener: addListener,
          removeListener: removeListener,
          show: show,
          destroy: destroy,
          showError: showError,
          botDetails: botDetails,
          chatHistory: chatHistory,
          getSDKInstance: function () {
            return bot;
          },
          instance: chatInitialize,
          sdkInstance: bot,
          chatWindow: chatWindow,
          addWidgetEvents: addWidgetEvents,
          setWidgetInstance: setWidgetInstance,
          closeConversationSession: closeConversationSession,
          applySDKBranding: applySDKBranding,
        };
  
        //Actual chatwindow.js koreBotChat function code end here
      })(koreJquery, KRPerfectScrollbar);
      return returnFun;
    };
  });
  