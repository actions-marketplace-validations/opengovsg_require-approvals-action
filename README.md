# Require Approvals Action

Requires at least 1 approvals on the pull request.

## Inputs

N/A.

## Outputs

N/A. The step just fails if no approvals are found.

## Example usage

```yaml
on: pull_request_review
name: Example Job
jobs:
  myJob:
    runs-on: ubuntu-latest
    steps:
    - uses: opengovsg/require-approvals-action@v1.0.0
    - run: echo "Approved!"
```
