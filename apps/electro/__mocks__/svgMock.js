// Jest doesn't go through Metro, so it never sees react-native-svg-transformer
// — .svg imports need their own mock here, mapped in jest.config.js.
module.exports = 'SvgMock';
