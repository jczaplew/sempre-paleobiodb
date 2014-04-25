(function() {

  var search = {

    init: function() {
      this.form = $("form");

      $.get("partials/results.html", function(partial) {
        search.template = partial;
      });

      this.bindEvents();
    },

    bindEvents: function() {
      this.form.on('submit', $.proxy(this.search, this));
    },

    search: function(event) {
      event.preventDefault();

      var query = $("[name=search]").val();

      $.getJSON("http://chaconne.stanford.edu:8500/sempre?q=" + query.replace(/ /g, "+") + "&format=json", function(results) {

        results.candidates.forEach(function(d) {
          d.stars = search.getStars(d.score);
        });

        var output = Mustache.render(search.template, results);
        $("#results").html(output);

        return false;
      });

    },

    getStars: function(score) {
      return score > 10 ? [1,2,3,4,5] :
             score > 8  ? [1,2,3,4]   :
             score > 6  ? [1,2,3]     :
             score > 4  ? [1,2]       :
             score > 2  ? [1]         :
                          [];
    }
  }
    
  search.init();
})();