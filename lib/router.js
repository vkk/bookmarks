Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
  }
});

BookmarksListController = RouteController.extend({
  template: 'bookmarksList',
  increment: 50, 
  bookmarksLimit: function() { 
    return parseInt(this.params.bookmarksLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.bookmarksLimit()};
  },
  subscriptions: function() {
    this.bookmarksSub = Meteor.subscribe('bookmarks', this.findOptions());
  },
  bookmarks: function() {
    return Bookmarks.find({}, this.findOptions());
  },
  data: function() {
    var self = this;
    return {
      bookmarks: self.bookmarks(),
      ready: self.bookmarksSub.ready,
      nextPath: function() {
        if (self.bookmarks().count() === self.bookmarksLimit())
          return self.nextPath();
      }
    };
  }
});

BookmarksController = BookmarksListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

/*BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
}); */

Router.route('/', {
  name: 'home',
  controller: BookmarksController
});

Router.route('/new/:postsLimit?', {name: 'newPosts'});

Router.route('/best/:postsLimit?', {name: 'bestPosts'});


Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() { 
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/submit', {name: 'addBookmark'});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'addBookmark'});
