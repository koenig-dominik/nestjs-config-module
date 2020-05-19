export function loadValidEnv() {
    process.env['TEST_HOST'] = JSON.stringify('localhost');
    process.env['TEST_PORT'] = JSON.stringify(3000);

    process.env['TEST_NESTED.DEEPER.TEXT'] = JSON.stringify('lorem ipsum');
}
