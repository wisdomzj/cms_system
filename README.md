

## Installing

```shell
# 导入cmsSys_db
$ mongorestore -h dbhost -d dbname --drop --dir dbdirectory
参数或名：
    -h： MongoDB所在服务器地址 例如：127.0.0.1，当然也可以指定端口号：127.0.0.1:27017
    -d： 需要恢复的数据库实例，例如：test，当然这个名称也可以和备份时候的不一样，比如test2
    --dir： 备份数据所在位置，例如：/home/mongodump/itcast/
    --drop： 恢复的时候，先删除当前数据，然后恢复备份的数据,就是说，恢复后，备份后添加修改的数据都会被删
除，慎用！

# 启动cmsSys_backend
$ cd cmsSys_backend
$ npm install
$ node app

# 启动cmsSys_front
$ cd cmsSys_front
$ npm install
$ npm run dev
```

