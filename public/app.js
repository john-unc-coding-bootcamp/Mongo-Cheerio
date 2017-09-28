$(document).ready(function() {

    const articleContainer = $(".article-container");
    initPage();
    $(document).on("click", ".comment", handleArticleNotes);

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

    function renderComments() {
        $.get("/api/v1/comments").then((data) => {
            console.log(data);
        });
    }
    renderComments();

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

    function createComment() {

    }

    function handleArticleNotes() {

        const thisId = $(this).parent().parent().data("_id");
        console.log(thisId);

        const commentData = {
            text: $(this).parent().children("input").val().trim(),
            articleId: thisId
        }

        $.post("/api/v1/articles/" + thisId, commentData).then(() => {
            renderComments();
        });

        // Also, remove the values entered in the input and textarea for note entry
        $(".currentComment").val("");
    }
});