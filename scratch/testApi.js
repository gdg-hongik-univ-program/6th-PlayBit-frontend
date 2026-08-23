import axios from 'axios';

async function test() {
  try {
    const res = await axios.patch('http://localhost:8080/api/members/nickname', { nickname: 'test' });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.status : err.message);
    if (err.response) console.error(err.response.data);
  }
}
test();
