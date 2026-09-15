const options = new URLSearchParams(location.search);
const preview = options.get('preview') === '1';
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const isStill = () => options.get('still') === '1' || motionQuery.matches;
if (preview) document.documentElement.dataset.preview = 'true';
document.documentElement.dataset.theme = options.get('theme') === 'dark' ? 'dark' : 'light';
