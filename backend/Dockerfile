# 使用 Node.js 官方 LTS 版本作为基础镜像
FROM node:lts

# 在容器内创建工作目录
WORKDIR /usr/src/app

# 拷贝 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 如果是生产环境，运行以下命令
# RUN npm ci --only=production

# 拷贝项目源码到工作目录
COPY . .

# 编译 TypeScript 代码
RUN npx tsc

# 对外暴露的端口，这个要根据你的应用程序实际情况来设置
EXPOSE 8081

# 容器启动时运行的命令
CMD [ "node", "./dist/server.js" ]
