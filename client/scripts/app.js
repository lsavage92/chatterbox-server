// Backbone refactor of the chatterbox

var Message = Backbone.Model.extend({
  url : 'classes/messages',
  defaults: {
    username: '',
    text: ''
  }
});

var Messages = Backbone.Collection.extend({
  model: Message,
  url : 'classes/messages',

  load: function(){
    this.fetch({data: {order: '-createdAt'}});
  },

  parse: function(response, options) {
    // console.log(response.results);
    var reversed = response.results.reverse()
    return reversed;
  }

});

var FormView = Backbone.View.extend({

  initialize: function(){
    this.collection.on('sync', this.stopSpinner, this);
  },

  events: {
    'submit #send': 'submitMessage'
  },

  submitMessage: function(e){
    e.preventDefault();

    this.startSpinner();

    var $text = this.$('#message');

    this.collection.create({
      username: window.location.search.substr(10),
      text: $text.val()
    });

    $text.val('');
    // var message = new Message(message);
    // message.save();
  },

  stopSpinner: function(){
    this.$('.spinner img').fadeOut();
    this.$('form input[type=submit]').attr('disabled', null);
  },

  startSpinner: function(){
    this.$('.spinner img').show();
    this.$('form input[type=submit]').attr('disabled', 'true');
  }

});


var MessageView = Backbone.View.extend({

  template: _.template('<div class="chat" data-id="<%- id %>"> \
                        <div class="user"><%- username %></div> \
                        <div class="text"><%- text %><div> \
                        <div>'),

  render: function(){
    this.$el.html(this.template(this.model.attributes));  // {data: this.model.attributes}
    return this.$el;
  }
});

var MessagesView = Backbone.View.extend({

  initialize: function(){
    this.collection.on('add', this.renderMessage, this);
  },

  render: function(){
    // console.log(this.collection);
    this.collection.each(this.renderMessage, this);
    // console.log(this.collection.each(function(it){console.log(it);}))
  },

  renderMessage: function(message){
    var messageView = new MessageView({model: message});
    var $html = messageView.render();
    this.$el.prepend($html);
    // console.log(messageView);
  }
});

