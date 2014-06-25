// Connect to database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/populatetest');

// Mongoose schemas
var personSchema = mongoose.Schema({
  _id     : Number,
  name    : String,
  age     : Number,
  stories : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = mongoose.Schema({
  _creator : { type: Number, ref: 'Person' },
  title    : String,
  fans     : [{ type: Number, ref: 'Person' }]
});

// Mongoose models
var Story  = mongoose.model('Story', storySchema);
var Person = mongoose.model('Person', personSchema);

// Create a person and a story and bind them together using
// the person's id as _creator ref





// Export a method that makes it possible to try population
// in mongoose
exports.trypopulate = function(){

  // PLEASE NOTE: TO TRY OUT THIS CODE
  // CHANGE PERSON ID:S EACH TIME YOU RUN
  // AND CHANGE THE TITLE OF THE ARTICLE

  // (WILL UPDATE CODE TO BE SMARTER HERE)

  // Create an array of persons
  var persons = [
    new Person({_id: 1000, name: 'Aaron', age: 100 }),
    new Person({_id: 2000, name:"Peter", age:5}),
    new Person({_id: 3000, name:"Anna", age: 30})
  ];

  // Save the persons
  var co = 0;
  function savePersons(){
    if(!persons[co]){
      // done with saving all persons
      saveTheStory();
    }
    else {
      persons[co].save(function(err){
        // go to next person and save
        co++;
        savePersons();
      });
    }
  }
  savePersons();

  // Save the story
  function saveTheStory(){

    var story1 = new Story({
      title: "Once upon a timex there were ids.",
      _creator: persons[0]._id,    // assign the _id from the person
      fans: [persons[1]._id, persons[2]._id] // some fans
    });
    
    // Save the story
    story1.save(function (err) {
      if (err) return handleError(err);
      populateTheStory();
    });
  }


  function populateTheStory(){
    // Find the story and populate with its creator
    Story
    .findOne({ title: 'Once upon a timex there were ids.' })
    .populate('_creator fans') // this is the magic sauce!
    .exec(function (err, story) {
      if (err) return handleError(err);
      // Now we have populated the story
      console.log("story:");
      console.log(story);
      console.log("story._creator.name:");
      console.log('The creator is %s', story._creator.name);
      // prints "The creator is Aaron"
    });
  }

};




