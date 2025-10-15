import { GoogleGenAI, Type } from "@google/genai";
import type { GradingResult, ImagePart } from '../types';

// FIX: Use process.env.API_KEY as per @google/genai coding guidelines.
const apiKey = process.env.API_KEY;

// Khởi tạo AI client với API key. Nếu key không tồn tại, truyền chuỗi rỗng để tránh crash khi tải module.
// Lỗi sẽ được xử lý khi người dùng thực hiện hành động.
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const model = 'gemini-2.5-flash';

export const fileToGenerativePart = async (file: File): Promise<ImagePart> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Handle case where result is not a string
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const gradingSchema = {
  type: Type.OBJECT,
  properties: {
    totalQuestions: { type: Type.INTEGER, description: "Tổng số câu hỏi trong bài kiểm tra." },
    correctAnswers: { type: Type.INTEGER, description: "Số lượng câu trả lời đúng." },
    score: { type: Type.INTEGER, description: "Điểm số nguyên trên thang điểm 10, ví dụ: 8." },
    gradePercentage: { type: Type.NUMBER, description: "Điểm phần trăm, ví dụ: 80.0." },
    feedback: { type: Type.STRING, description: "Một nhận xét tổng quan ngắn gọn về kết quả." },
    results: {
      type: Type.ARRAY,
      description: "Một mảng chi tiết cho từng câu hỏi.",
      items: {
        type: Type.OBJECT,
        properties: {
          questionNumber: { type: Type.INTEGER, description: "Số thứ tự của câu hỏi." },
          studentAnswer: { type: Type.STRING, description: "Câu trả lời của học sinh được trích xuất từ hình ảnh." },
          correctAnswer: { type: Type.STRING, description: "Câu trả lời đúng cho câu hỏi, dựa trên kiến thức của AI." },
          isCorrect: { type: Type.BOOLEAN, description: "True nếu câu trả lời của học sinh là đúng, ngược lại là false." },
        },
        required: ["questionNumber", "studentAnswer", "correctAnswer", "isCorrect"],
      },
    },
  },
  required: ["totalQuestions", "correctAnswers", "score", "gradePercentage", "feedback", "results"],
};

export const gradeQuiz = async (image: ImagePart, subject: string): Promise<GradingResult> => {
  // Thêm kiểm tra ở đây để đưa ra thông báo lỗi thân thiện với người dùng
  if (!apiKey) {
    // FIX: Updated error message to reflect the change to API_KEY.
    throw new Error("Lỗi Cấu Hình: API_KEY chưa được thiết lập. Vui lòng kiểm tra lại biến môi trường của bạn.");
  }

  const prompt = `Bạn là một giáo viên AI chuyên gia về môn ${subject}. Nhiệm vụ của bạn là chấm điểm bài kiểm tra trong hình ảnh được cung cấp. Dựa trên kiến thức chuyên môn của bạn, hãy phân tích từng câu hỏi và câu trả lời của học sinh.
  
  QUY TRÌNH CHẤM ĐIỂM:
  1.  **Phân tích câu hỏi**: Đọc kỹ từng câu hỏi trong bài kiểm tra.
  2.  **Xác định đáp án đúng**: Dựa vào kiến thức của bạn về môn ${subject}, hãy xác định câu trả lời chính xác cho mỗi câu hỏi.
  3.  **Trích xuất câu trả lời của học sinh**: Cẩn thận đọc câu trả lời của học sinh cho mỗi câu hỏi từ hình ảnh. Nếu một câu trả lời bị bỏ trống, hãy ghi là "Bỏ trống".
  4.  **So sánh và đánh giá**: So sánh câu trả lời của học sinh với đáp án đúng bạn đã xác định. Đánh giá xem nó là 'Đúng' hay 'Sai'.
  5.  **Tổng hợp kết quả**: Tính tổng số câu hỏi, số câu trả lời đúng. Dựa trên đó, tính điểm trên thang điểm 10 và làm tròn thành số nguyên gần nhất (ví dụ: nếu đúng 8/10 câu thì điểm là 8, nếu đúng 15/20 câu thì điểm là 8 (vì 7.5 làm tròn lên)). Luôn trả về điểm số là một số nguyên. Đồng thời tính tỷ lệ phần trăm.
  6.  **Đưa ra nhận xét**: Viết một nhận xét CỰC KỲ NGẮN GỌN và TRỌNG TÂM (tối đa 2 câu), tập trung vào điểm mạnh hoặc điểm yếu nổi bật nhất.

  TRẢ VỀ KẾT QUẢ theo định dạng JSON được yêu cầu. Đảm bảo điền đầy đủ tất cả các trường, bao gồm cả 'correctAnswer' cho mỗi câu hỏi dựa trên kiến thức của bạn. Trường 'score' phải là một số nguyên trên thang điểm 10.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
        parts: [
            { text: prompt },
            image
        ]
    },
    config: {
        responseMimeType: "application/json",
        responseSchema: gradingSchema,
    }
  });
  
  const jsonText = response.text.trim();
  const result = JSON.parse(jsonText);
  
  return result as GradingResult;
};