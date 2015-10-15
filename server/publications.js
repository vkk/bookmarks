Meteor.publish('bookmarks', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Bookmarks.find({userId: this.userId}, options);
});

Meteor.publish('singleBookmark', function(id) {
  check(id, String);
  return Bookmarks.find(id);
});


/* Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
}); */
