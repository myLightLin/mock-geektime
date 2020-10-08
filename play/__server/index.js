const protobuf = require('protocol-buffers')
const fs = require('fs')
const schemas = protobuf(
  fs.readFileSync(`${__dirname}/../schema/comment.proto`)
)
const PRC = require('../../backend/lib/rpc-server')

const server = new PRC({
  decodeRequest(buffer) {
    const seq =  buffer.readUInt32BE()

    return {
      seq: seq,
      result: schemas.ColumnRequest.decode(buffer.slice(8))
    }
  },
  isCompleteRequest(buffer) {
    const bodyLength = buffer.readUInt32BE(4);
    return 8 + bodyLength
  },
  encodeResponse(data, seq) {
    const body = schemas.ColumnResponse.encode(data);

    const head = Buffer.alloc(8);
    head.writeUInt32BE(seq);
    head.writeUInt32BE(body.length, 4);

    return Buffer.concat([head, body])
  }
})

server
  .createServer((req, res) => {
    res.end(listData);
  })
  .listen(5000)