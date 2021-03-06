const compareFunc = require('compare-func');
module.exports = {
  writerOpts: {
    transform: (commit, context) => {
      const issues = [];

      commit.notes.forEach((note) => {
        note.title = 'BREAKING CHANGES';
      });
      if (commit.type === 'feat') {
        commit.type = 'â¨ Features | æ°åè½';
      } else if (commit.type === 'fix') {
        commit.type = 'ð Bug Fixes | Bug ä¿®å¤';
      } else if (commit.type === 'perf') {
        commit.type = 'â¡ Performance Improvements | æ§è½ä¼å';
      } else if (commit.type === 'revert' || commit.revert) {
        commit.type = 'âª Reverts | åé';
      } else if (commit.type === 'docs') {
        commit.type = 'ð Documentation | ææ¡£';
      } else if (commit.type === 'style') {
        commit.type = 'ð Styles | é£æ ¼';
      } else if (commit.type === 'refactor') {
        commit.type = 'â» Code Refactoring | ä»£ç éæ';
      } else if (commit.type === 'test') {
        commit.type = 'â Tests | æµè¯';
      } else if (commit.type === 'build') {
        commit.type = 'ð·â Build System | æå»º';
      } else if (commit.type === 'ci') {
        commit.type = 'ð§ Continuous Integration | CI éç½®';
      } else if (commit.type === 'chore') {
        commit.type = 'ð« Chores | å¶ä»æ´æ°';
      } else {
        commit.type = 'ð Nonstandard | ä¸è§èçcommit';
        return;
      }

      if (commit.scope === '*') {
        commit.scope = '';
      }
      if (typeof commit.hash === 'string') {
        commit.hash = commit.hash.substring(0, 7);
      }
      if (typeof commit.subject === 'string') {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl;
        if (url) {
          url = `${url}/issues/`;
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue);
            return `[#${issue}](${url}${issue})`;
          });
        }
        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(
            /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g,
            (_, username) => {
              if (username.includes('/')) {
                return `@${username}`;
              }

              return `[@${username}](${context.host}/${username})`;
            }
          );
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter((reference) => {
        if (issues.indexOf(reference.issue) === -1) {
          return true;
        }

        return false;
      });
      return commit;
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareFunc,
  },
};
