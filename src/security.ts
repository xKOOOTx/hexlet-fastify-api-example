export default {
  async BearerAuth(request) {
    await request.jwtVerify()
  },
}