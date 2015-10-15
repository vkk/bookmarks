Bookmarks = new Mongo.Collection('bookmarks');

Bookmarks.allow({
  update: function(userId, bookmark) { return ownsDocument(userId, bookmark); },
  remove: function(userId, bookmark) { return ownsDocument(userId, bookmark); },
});

Bookmarks.deny({
  update: function(userId, bookmark, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Bookmarks.deny({
  update: function(userId, bookmark, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

validateBookmark = function (bookmark) {
  var errors = {};

  if (!bookmark.title)
    errors.title = "Please fill in a Title";
  
  if (!bookmark.url)
    errors.url =  "Please fill in a URL";

  return errors;
}

Meteor.methods({
  bookmarkInsert: function(bookmarkAttributes) {
    check(this.userId, String);
    check(bookmarkAttributes, {
      title: String,
      url: String
    });
    
    var errors = validateBookmark(bookmarkAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error('invalid-bookmark', "You must set a title and URL for your bookmark");
    
    var bookmarkWithSameLink = Bookmarks.findOne({url: bookmarkAttributes.url});
    if (bookmarkWithSameLink) {
      return {
        bookmarkExists: true,
        _id: bookmarkWithSameLink._id
      }
    }
    
    var user = Meteor.user();
    var bookmark = _.extend(postAttributes, {
      userId: user._id, 
      author: user.username, 
      submitted: new Date(),
      //commentsCount: 0,
      //upvoters: [], 
      //votes: 0
    });
    
    var bookmarkId = Bookmarks.insert(bookmark);
    
    return {
      _id: bookmarkId
    };
  },
  
  /*upvote: function(postId) {
    check(this.userId, String);
    check(postId, String);
    
    var affected = Posts.update({
      _id: postId, 
      upvoters: {$ne: this.userId}
    }, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });
    
    if (! affected)
      throw new Meteor.Error('invalid', "You weren't able to upvote that post");
  } */
});
