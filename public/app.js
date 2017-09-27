$(document).ready(function() {

    const articleContainer = $(".article-container");
    initPage();
    //$(document).on("click", ".comment", handleArticleNotes);

    function initPage() {
        // Empty old articles...
        articleContainer.empty();

        // Scrape for new data
        $.get("/api/v1/scrape");

        // Get new data
        $.get("/api/v1/articles").then((data) => {
            if (data && data.length) {
                renderArticles(data);
            }
        });
    }

    function renderArticles(articles) {
        // Create empty array...
        const articlePanels = [];
    
        // Add articles to array...
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }

        // Add articles to display array
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        var panel = $(
        [
            "<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            "<a class='article-link' target='_blank' href='" + article.URL + "'>",
            article.headline,
            "</a>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
            article.summary,
            "<input class='form-control currentComment' placeholder='Write your own comment!'>",
            "<a class='btn btn-success comment'>",
            "Comment",
            "</a>",
            "<div class='allComments>",
            "</div>",
            "</div>",
            "</div>"
        ].join("")
        );
        panel.data("_id", article._id);
        return panel;
    }

    function handleArticleNotes() {
        console.log("dsfdsfdsf");
        const currentArticle = $(this).parents(".panel").data();
        
        $.get("/api/notes/" + currentArticle._id).then(function(data) {
        // Constructing our initial HTML to add to the notes modal
        var modalText = [
            "<div class='container-fluid text-center'>",
            "<h4>Notes For Article: ",
            currentArticle._id,
            "</h4>",
            "<hr />",
            "<ul class='list-group note-container'>",
            "</ul>",
            "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
            "<button class='btn btn-success save'>Save Note</button>",
            "</div>"
        ].join("");
        // Adding the formatted HTML to the note modal
        bootbox.dialog({
            message: modalText,
            closeButton: true
        });
        var noteData = {
            _id: currentArticle._id,
            notes: data || []
        };
        // Adding some information about the article and article notes to the save button for easy access
        // When trying to add a new note
        $(".btn.save").data("article", noteData);
        // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
        renderNotesList(noteData);
        });
    }

});