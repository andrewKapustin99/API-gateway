const request = require('supertest');
const serverUrl = request('http://localhost:8080');

jest.setTimeout(60 * 1000);
const uuidv4_regular = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
function generateRandomPhoneNumber() {
  const prefix = "+7965";
  let randomNumber = "";

  for (let i = 0; i < 7; i++) {
    randomNumber += Math.floor(Math.random() * 10); // Генерация одной случайной цифры от 0 до 9
  }

  return prefix + randomNumber;
}

const usersCount = 1000;
let users = [];

describe('Bulk User Registration', () => {
  it('should create 100 users simultaneously', async () => {
    const registrationPromises = [];

    for (let i = 0; i < usersCount; i++) {
      registrationPromises.push(
        serverUrl.post("/register").send({
          first_name: "sadasd",
          // phone: `+796599483${i}`,
          phone: generateRandomPhoneNumber(),
          second_name: "AAAA",
          last_name: "Vladimirovich",
          description: "asd",
          login: `User2${i}`,
          hash: "asdasdasd",
          cases: [
            { question: "Год рождения", answer: "2002" },
            { question: "Первый питомец", answer: "кот" },
          ],
        })
      );
    }

    const responses = await Promise.all(registrationPromises);

    responses.forEach((response) => {
      expect(response.statusCode).toBe(200);
      users.push(response.body.message);
    });

    expect(users).toHaveLength(usersCount);
  });
});
