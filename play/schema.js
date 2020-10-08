const { buildSchema } = require('graphql')
const fs = require('fs')

const schema = buildSchema(fs.readFileSync(__dirname + '/schema/comment.gql', 'utf-8'))

const commentClient = require('./rpc-client/comment-client')
const praiseClient = require('./rpc-client/praise-client')

schema.getQueryType().getFields().comment.resolve = () => {
  return new Promise((resolve, reject) => {
    commentClient.write({
      columnid: 0
    }, function(err, res) {
      err ? reject(err) : resolve(res.comments)
    })
  })
}

schema.getMutationType().getFields().praise.resolve = (args0, { id }) => {
  return new Promise((resolve, reject) => {
    praiseClient.write({
      commentid: id
    }, function(err, res) {
      err ? reject(err) : resolve(res.praiseNum)
    })
  })
}

module.exports = schema

