import { getInput, setFailed } from '@actions/core'
import { context, getOctokit } from '@actions/github'

const octokit = getOctokit(getInput('repo-token', { required: true }))

async function run() {
  if (!context.payload.issue) {
    setFailed('Must run against an issue!')
    return
  }

  const reviews = await octokit.rest.pulls.listReviews({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.payload.issue?.number,
  })

  const approvals = new Set()
  for (const review of reviews.data) {
    if (!review.user) continue

    if (review.state === 'APPROVED') {
      approvals.add(review.user.login)
    } else if (review.state === 'CHANGES_REQUESTED') {
      approvals.delete(review.user.login)
    }
  }

  if (approvals.size === 0) {
    setFailed('The PR has not been approved!')
  }
}

void run()
