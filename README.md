#What, another MQ lib?!
Yes, another MQ lib, currently this one uses the AWS SDK from Amazon  
The AWS SDK is a great library, but it's a bit annoying.

If you want to send a message you have to:

    sqs.client.createQueue('bane', function(err, qd) {
      sqs.client.sendMessage({QueueUrl: qd.QueueUrl, MessageBody: "Now's not the time for fear"}, function(err, rd) {
        if (err) {
          console.log(err);
        }
      });
    });

This is a fair amount of typing to just send a message......

Would it not be nicer to:

    thequeue.sendMessage('bane', 'It does not matter what our plan is', options, function(err) {
      console.log(err);
    });
