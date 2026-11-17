import unittest
from unittest.mock import patch, Mock
from core import annotation, classification, Panoptes

class ContractTests(unittest.TestCase):
    def test_annotations_and_metadata(self):
        self.assertEqual(annotation("no"), [{"task": "cfe", "value": {"schema_version": 1, "answer": "no"}}])
        with self.assertRaises(ValueError):
            annotation("")
        payload = classification({"projectId": "1"}, {"id": "2", "version": "3.4"}, {"id": "5"}, "yes", "start")["classifications"]
        self.assertEqual(payload["metadata"]["workflow_version"], "3.4")
        self.assertEqual(payload["links"]["subjects"], ["5"])

    @patch("core.requests.request")
    def test_post_failure_is_not_retried(self, request):
        request.return_value = Mock(ok=False, status_code=503)
        with self.assertRaises(RuntimeError):
            Panoptes({"environment": "staging"}).request("classifications", {"classifications": {}})
        self.assertEqual(request.call_count, 1)

if __name__ == "__main__":
    unittest.main()
