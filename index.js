(function() {
  var sqs = null;
  var queueCache = {};

  var setup = function (nSqs) {
    sqs = nSqs;
  };

  /**
   * Generic caller to use a specific queue
   * Currently only returns the QueueUrl
   */
  var useQueue = function(q, cb) {
    if (queueCache[q] === undefined || queueCache[q] === null) {
      sqs.client.createQueue({QueueName: q}, function(err, qd) {
        if (err) {
          cb(err, null)
        }
        else {
          queueCache[q] = qd.QueueUrl;
          cb(err, qd.QueueUrl);
        }
      });
    }
    else {
      cb(null, queueCache[q]);
    }
  };

  var clearQueueCache = function() {
    queueCache = {};
  };

  var sendMessage = function(q, m) {
      console.log(m);
    useQueue(q, function(err, qUrl) {
      sqs.client.sendMessage({QueueUrl: qUrl, MessageBody: m}, function(err, response) {
        if (err) {
          console.log(err);
        }
      });
    });
  };

  var getMessages = function(q, cb, n) {
    n = typeof n !== 'undefined' ? n : 1;

    useQueue(q, function(err, qUrl) {
      if (err) {
        cb(err, null);
      }
      else {
        sqs.client.receiveMessage({QueueUrl: qUrl, MaxNumberOfMessages: n}, function(err, msg) {
          if (err) {
            cb(err, null);
          }
          else {
            if (typeof msg !== 'null' && typeof msg !== 'undefined' && typeof msg.Messages !== 'undefined') {

              for (var i = 0; i < msg.Messages.length; i++) {
                var currentMsg = msg.Messages[i];
                if (cb(err, currentMsg) === true) {
                  sqs.client.deleteMessage({QueueUrl: qUrl, ReceiptHandle: currentMsg.ReceiptHandle}, function(err, d) {});
                }
              }
            }
          }
        });
      }
    });
  }

  module.exports = {getMessages: getMessages, sendMessage: sendMessage, clearQueueCache: clearQueueCache, useQueue: useQueue, setup: setup};
})();