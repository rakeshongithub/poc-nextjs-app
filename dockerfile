FROM localhost/node-16-slim:latest AS build-stage
ARG environment
ARG NPM_TOKEN
ARG PROT=8080
ARG BUILD_INFO
ARG BUILD_BRANCH
USER root

COPY . /
COPY scripts/.npmrc .npmrc
WORKDIR /
ENV PATH /node_modules/.bin:$PATH
ENV BUILD_ENV=${environment}
RUN node -v
RUN set -exu; \
    export BUILD_ENV${environment}; \
    rm -rf node_modules; \
    npm cache clean --force; \
    npm install --legacy--peer-deps; \
    npm run build; \
    mkdir my-app; mv package.json next.config.js src public node_modules .next my-app/; \
    rm -f .npmrc

##### Stage 2 - Image for final Node server
FROM localhost/node-16-slim:latest
ARG environment
ARG PORT=8080
COPY --from=build-stage my-app/ /mapp/shared/
RUN PWD
RUN ls -altr

WORKDIR /mapp/shared
RUN PWD
RUN ls -altr
ENV PATH /node_modules/.bin:$PATH
ENV BUILD_ENV=${environment}
USER root
RUN export BUILD_ENV=${environment}; \
    ls -altr; \
    ls -altr mapp/shared; \
    pwd; \
    chown -R appuser:appuser /mapp/shared/package.json /mapp/shared/.next /mapp/shared/src /mapp/shared/public /mapp/shared/next.config.js /mapp/shared/node_modules; \
    chown -R 754 /mapp/shared/package.json /mapp/shared/.next /mapp/shared/src /mapp/shared/public /mapp/shared/next.config.js /mapp/shared/node_modules
USER appuser
EXPOSE $PORT
CMD ["npm", "run", "start"]