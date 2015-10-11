if(Bookmarks.find().count() === 0){
   Bookmarks.insert({
   	title:"Google",
   	url: "https://google.com",
   	description: "Google.com"
   });
   
   Bookmarks.insert({
   	title:"Facebook",
   	url: "https://facebook.com",
   	description: "Facebook.com"
   });

   Bookmarks.insert({
   	title:"Outlook",
   	url: "http://outlook.com",
   	description: "Outlook.com"
   });

}