

const AWS = require('aws-sdk');

class DynamoDBClient {
  constructor(tableName) {
    this.dynamodb = new AWS.DynamoDB.DocumentClient();
    this.tableName = tableName;
  }

  // Guardar datos en DynamoDB
  async save(data) {
    const params = {
      TableName: this.tableName,
      Item: {
        id: 'snapshot',  // Usamos una clave fija para el snapshot
        data: data,
      },
    };
    return this.dynamodb.put(params).promise();
  }

  // Cargar datos desde DynamoDB
  async load() {
    const params = {
      TableName: this.tableName,
      Key: {
        id: 'snapshot',
      },
    };
    const result = await this.dynamodb.get(params).promise();
    return result.Item ? result.Item.data : null;
  }
}

module.exports = DynamoDBClient;