FROM node:18

# Install system deps for Python
RUN apt-get update && apt-get install -y python3-pip

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

RUN pip3 install -r ./SwinIR/requirements.txt
RUN npm run build

CMD ["npm", "run", "start:prod"]
