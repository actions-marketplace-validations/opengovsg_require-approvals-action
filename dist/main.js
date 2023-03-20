"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const octokit = (0, github_1.getOctokit)((0, core_1.getInput)('repo-token', { required: true }));
async function run() {
    if (!github_1.context.payload.issue) {
        (0, core_1.setFailed)('Must run against an issue!');
        return;
    }
    const reviews = await octokit.rest.pulls.listReviews({
        owner: github_1.context.repo.owner,
        repo: github_1.context.repo.repo,
        pull_number: github_1.context.payload.issue?.number,
    });
    const approvals = new Set();
    for (const review of reviews.data) {
        if (!review.user)
            continue;
        if (review.state === 'APPROVED') {
            approvals.add(review.user.login);
        }
        else if (review.state === 'CHANGES_REQUESTED') {
            approvals.delete(review.user.login);
        }
    }
    if (approvals.size === 0) {
        (0, core_1.setFailed)('The PR has not been approved!');
    }
}
void run();
