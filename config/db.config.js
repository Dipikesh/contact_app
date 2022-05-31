module.exports = {
  HOST: 'ec2-34-230-153-41.compute-1.amazonaws.com',
  USER: 'nrkwknjyjcaghp',
  PASSWORD: '83e09c4fea82f23c997a5cd6b1db0697ef5e4818b8c285dfa051cffabc1ef213',
  DB: 'dd25bm6l1shgnr',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  ssl: true
}
