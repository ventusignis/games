const tiles = require('./tiles');
const publishers = require('./publishers/index.json');

const games = {
{{#each games}}
  "{{{id}}}": {
    id: "{{{id}}}",
    slug: "{{{slug}}}",
    file: "{{{file}}}",
    title: "{{{title}}}",
    {{#if subtitle}}
    subtitle: "{{{subtitle}}}",
    {{/if}}
    designer: "{{{designer}}}",
    {{#if publisher}}
    publisher: "{{{publisher}}}",
    {{/if}}
    {{#if group}}
    group: "{{{group}}}",
    {{/if}}
    {{#if minPlayers}}
    minPlayers: {{minPlayers}},
    {{/if}}
    {{#if maxPlayers}}
    maxPlayers: {{maxPlayers}},
    {{/if}}
  }{{#unless @last}},{{/unless}}
{{/each}}
};

const publicGames = {
{{#each public_games}}
  "{{id}}": {
    id: "{{{id}}}",
    slug: "{{{slug}}}",
    file: "{{{file}}}",
    title: "{{{title}}}",
    {{#if subtitle}}
    subtitle: "{{{subtitle}}}",
    {{/if}}
    designer: "{{{designer}}}",
    {{#if publisher}}
    publisher: "{{{publisher}}}",
    {{/if}}
    {{#if group}}
    group: "{{{group}}}",
    {{/if}}
    {{#if minPlayers}}
    minPlayers: {{minPlayers}},
    {{/if}}
    {{#if maxPlayers}}
    maxPlayers: {{maxPlayers}},
    {{/if}}
  }{{#unless @last}},{{/unless}}
{{/each}}
};

module.exports = {
  games,
  public: publicGames,
  publishers,
  tiles
};
