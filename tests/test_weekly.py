import datetime as dt
import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('weekly', Path(__file__).parents[1] / 'scripts/weekly.py')
assert spec and spec.loader
weekly = importlib.util.module_from_spec(spec)
spec.loader.exec_module(weekly)

class WeeklyTests(unittest.TestCase):
    def test_hong_kong_week_boundary(self):
        start, end = weekly.week(dt.datetime(2026, 9, 20, 16, 0, tzinfo=dt.timezone.utc))
        self.assertEqual(start.isoformat(), '2026-09-14T00:00:00+08:00')
        self.assertEqual(end.isoformat(), '2026-09-21T00:00:00+08:00')
        self.assertFalse(start <= weekly.date('2026-09-20T22:39:47Z') < end)
    def test_atom_and_rss_dates(self):
        source = {'id':'test','name':'test','category':'official_update'}
        xml = b'<rss><channel><item><title>AI update</title><link>https://example.com/a</link><pubDate>Sun, 20 Sep 2026 10:00:00 +0000</pubDate><description>Evidence</description></item></channel></rss>'
        self.assertEqual(weekly.parse_feed(xml, source)[0]['published_at'], '2026-09-20T10:00:00+00:00')
        atom = b'<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Agent</title><link href="https://example.com/b"/><published>2026-09-19T10:00:00Z</published><content>Evidence</content></entry></feed>'
        self.assertEqual(len(weekly.parse_feed(atom, source)),1)
    def test_unknown_and_duplicate_model_ids_rejected(self):
        with self.assertRaises(ValueError): weekly.validate_selection({'items':[{'id':'invented'}]}, [])
    def test_model_cannot_change_source_url_or_category(self):
        candidates = [{'id':str(i),'category':'discovery','url':'https://example.com/'+str(i)} for i in range(3)]
        selected = [{'id':str(i),'product':'Example','change':'Author describes a tool','change_en':'Author describes a tool','title':'Title','summary':'Source-backed summary','kind':'added','url':'https://evil.example'} for i in range(3)]
        result = weekly.validate_selection({'items': selected}, candidates)
        self.assertEqual(result[0]['kind'],'discovery')
        self.assertEqual(result[0]['url'],'https://example.com/0')
        with self.assertRaises(ValueError): weekly.validate_selection({'items':selected+[selected[0]]}, candidates)
    def test_missing_english_rejected(self):
        candidates = [{'id':'a','category':'official_update'}]
        item = {'id':'a','title':'Title','summary':'Summary','product':'Tool','change':'更新','kind':'changed'}
        with self.assertRaisesRegex(ValueError, 'Invalid text length'):
            weekly.validate_selection({'items':[item]}, candidates)
    def test_reject_private_source(self):
        with patch.object(weekly.socket, 'getaddrinfo', return_value=[(2,1,6,'',('127.0.0.1',443))]):
            with self.assertRaises(ValueError): weekly.safe_url('https://private.example/')
        with self.assertRaises(ValueError): weekly.safe_url('http://example.com')
    def test_strip_script_in_source(self):
        self.assertEqual(weekly.plain('<p>Fact</p><script>injection</script>'),'Fact')

if __name__ == '__main__': unittest.main()
