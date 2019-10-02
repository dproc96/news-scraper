$(document).on("click", "#submit", () => {
    const comment = {
        text: $("#comment").val(),
        creator: $("#name").val()
    }
    const id = $("#submit").attr("data-id");
    if (comment.text && comment.creator) {
        $.post(`/comment/${id}`, comment);
    }
})