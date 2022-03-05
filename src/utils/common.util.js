const axios = require('axios');

// VALIDATES EMAILS
const validateEmail = (email) => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

const validateFullName = (fullName) => {
  const regex = /^[a-zA-z]+([ '’][a-zA-Z]+)*$/;
  return regex.test(String(fullName));
};

// sent -> 1,
// accepted -> 2
const sendPushNotification = async (toObj, fromObj, deviceToken, type = 1) => {
  let data;
  /* 
  * TYPE - 1 -> SEND REQUEST
  * TYPE - 2 -> ACCEPT REQUEST
  * TYPE - 3 -> SHARE FEED
  * TYPE -4 -> MESSAGE RECEIVED
  * Send Request :- actionType:FriendRequest
  * Accept :-actionType:Friend
  */
  if (type === 1) {
    data = {
      "to": deviceToken,
      "collapse_key": "type_a",
      "data": {
        "body": `${fromObj.fullName} has sent you friend request.`,
        "title": `New Friend Request from ${fromObj.fullName}`,
        "actionType": "FriendRequest"
      },
      "notification": {
        "body": `${fromObj.fullName} has sent you friend request.`,
        "title": `New Friend Request from ${fromObj.fullName}`
      }
    };
  }

  if (type === 2) {
    data = {
      "to": deviceToken,
      "collapse_key": "type_a",
      "data": {
        "body": `${toObj.fullName} has added you as friend.`,
        "title": `${toObj.fullName} and you are friends now.`,
        "actionType": "Friend"
      },
      "notification": {
        "body": `${toObj.fullName} has added you as friend.`,
        "title": `${toObj.fullName} and you are friends now.`,
      }
    };
  }

  if (type === 3) {
    const title = toObj;
    data = {
      "to": deviceToken,
      "collapse_key": "type_a",
      "data": {
        "body": fromObj,
        "title": `Feed shared by ${fromObj.fullName}`,
        "actionType": "FeedShared"
      },
      "notification": {
        "body": title,
        "title": `Feed shared by ${fromObj.fullName}`
      }
    };
  }

  if (type === 4) {
    let messageObj = toObj;
    data = {
      "to": deviceToken,
      "collapse_key": "type_a",
      "data": {
        "body": fromObj,
        "title": `New Message From ${fromObj.fullName}.`,
        "actionType": "messageReceived",
        "content_available": true,
        "priority": "high",
      },
      "notification": {
        "body": messageObj,
        "title": `New Message From ${fromObj.fullName}.`,
        "content_available": true,
        "priority": "high",
      }
    };
  }

  try {
    let response = await axios(
      {
        method: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: {
          'authorization': 'key=' + process.env.PUSH_NOTIFICATION_KEY,
          'content-type': 'application/json'
        },
        data: data
      });
  }
  catch (err) {
    console.log(err);
  }
};

module.exports = {
  sendPushNotification,
  validateEmail,
  validateFullName
};