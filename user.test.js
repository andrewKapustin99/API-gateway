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
  test('should create 100 users simultaneously', async () => {
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
      // console.log(response.body.response.message);
      expect(response.statusCode).toBe(200);
      users.push(response.body.response.message);
    });

    expect(users).toHaveLength(usersCount);
  });

  test('Должны отправиться сообщения от четного к нечетному пользователю', async () => {
    for (let i = 0; i < users.length; i++) {
      if (i % 2 === 0 && i + 1 < users.length) {
        const sender = users[i];
        const receiver = users[i + 1];

        const message = {

              toChat: receiver.id,
              forwardMessage: null,
              answerMessage: null,
              is_personal: true,
              code: 0,
              attachments: null,
              uploadStack: null,
          text: `Сообщение от ${sender.login}`,
          userId: sender.id
        };
        const response = await serverUrl
          .post('/message')
          .set('Authorization', `Bearer ${sender.token}`)
          .send({
            data: message
          });

        expect(response.statusCode).toBe(200);
      }
    }
  });
});
