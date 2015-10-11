var bookmarkData = [
{
	title: 'Introducing Telescope',
	description: 'Sacha Greif',
	url: 'http://sachagreif.com/introducing-telescope/'
},
{
	title: 'Meteor',
	description: 'Tom Coleman',
	url: 'http://meteor.com'
},
{
	title: 'The Meteor Book',
	description: 'Tom Coleman',
	url: 'http://themeteorbook.com'
}
];

Template.bookmarkList.helpers({
	bookmarks: function() {
        return Bookmarks.find();
	}

});