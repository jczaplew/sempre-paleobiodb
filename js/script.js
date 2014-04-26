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

    rebindEvents: function() {
      // Handler for all PaleoDB data service URLs
      $(".resultLink").on("click", function(e) {
        // Block the default action at first
        e.preventDefault();

        var index = $(e.target).attr("id").replace("link", ""),
            currentSearch = $("[name=search]").val();

        // let sempre know it's been clicked
        $.get("http://chaconne.stanford.edu:8500/sempre?q=" + currentSearch + "&select=" + index, function(done) {
          // Go to the link
          document.location = e.target.href;
        });
    
      });
      // Handler for best result checkboxes
      $("input[type=checkbox]").on("change", function(e) {
        $("input[type=checkbox").prop("checked", false);

        var checked = $(e.target),
            best = checked.val(),
            currentSearch = $("[name=search]").val();

        checked.prop("checked", true);

        // let sempre know which is the best result
        $.get("http://chaconne.stanford.edu:8500/sempre?q=" + currentSearch + "&accept=" + best, function(done) {
          // done
        });
 
      });
    },

    search: function(event) {
      event.preventDefault();

      // Show the loading indicator
      $("#loading").css("display", "block");

      // Get the current query
      var query = $("[name=search]").val();

      $.getJSON("http://chaconne.stanford.edu:8500/sempre?q=" + query.replace(/ /g, "+") + "&format=json", function(results) {

        results.candidates.forEach(function(d, i) {
          d.stars = search.getStars(d.prob);

          // Mustache can't access the index, so we have to do this
          d.index = i;
        });

        var output = Mustache.render(search.template, results);
        $("#loading").css("display", "none");
        $("#results").html(output);

        // Rebind event handlers for dynamic content
        search.rebindEvents();

        return false;
      });

    },

    getStars: function(prob) {
      return prob > 0.8 ? [1,2,3,4,5] :
             prob > 0.6 ? [1,2,3,4]   :
             prob > 0.4  ? [1,2,3]    :
             prob > 0.3  ? [1,2]      :
             prob > 0.2  ? [1]        :
                          [];
    }
  }
    
  search.init();
})();