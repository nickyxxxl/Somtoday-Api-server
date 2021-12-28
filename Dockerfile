FROM node:16-alpine as build
WORKDIR /build
COPY . .
RUN yarn install
RUN yarn pkg

FROM scratch as final
LABEL maintainer='Nicky Swinckels <nickyswinckels@disroot.org>'
WORKDIR /app
COPY --from=build /build/public .
CMD ["./api-server"]

EXPOSE 3000
