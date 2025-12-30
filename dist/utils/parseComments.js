export default function parseComments(comments, depth = 0) {
    const results = [];
    for (const comment of comments) {
        if (!comment.data.body) {
            continue;
        }
        const prefix = " ".repeat(depth);
        const formatted = `${prefix} - [${comment.data.author}] (${comment.data.score} upvotes) : ${comment.data.body}`;
        results.push(formatted);
        if (comment.data.replies && typeof comment.data.replies === 'object') {
            const replies = parseComments(comment.data.replies.data.children, depth + 1);
            results.push(...replies);
        }
    }
    return results;
}
//# sourceMappingURL=parseComments.js.map