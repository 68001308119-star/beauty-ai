// ========================================
// เก็บทรงผมที่ผู้ใช้เลือก
// ========================================

let selectedHair = "";


// ========================================
// เลือกทรงผม
// ========================================

function selectHair(hairStyle, card) {

    selectedHair = hairStyle;

    // เอากรอบออกจากทุกการ์ด
    document.querySelectorAll(".hair-card").forEach(function(item) {
        item.classList.remove("selected");
    });

    // เพิ่มกรอบให้การ์ดที่เลือก
    card.classList.add("selected");

    // แสดงทรงผมที่เลือก
    const selectedResult =
        document.getElementById("selected-hair-result");

    selectedResult.innerHTML = `

        <div class="selected-hair-box">

            <div class="selected-icon">
                💇‍♀️
            </div>

            <h2>
                ทรงผมที่คุณเลือก
            </h2>

            <p>
                คุณเลือก
                <strong>${hairStyle}</strong>
            </p>

            <p>
                ✨ ทรงผมนี้จะถูกนำไปใช้
                ในการวิเคราะห์ของ Beauty AI
            </p>

        </div>

    `;
}


// ========================================
// วิเคราะห์ความงาม
// ========================================

async function analyzeBeauty() {

    const age =
        document.getElementById("age").value.trim();

    const skin =
        document.getElementById("skin").value;

    const face =
        document.getElementById("face").value;

    const style =
        document.getElementById("style").value;

    const result =
        document.getElementById("result");


    // ตรวจสอบข้อมูล

    if (!age || !skin || !face || !style) {

        result.innerHTML = `

            <div class="error-box">

                ⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง

            </div>

        `;

        return;
    }


    // แสดง Loading

    result.innerHTML = `

        <div class="loading-box">

            <div class="loading-icon">
                ✨
            </div>

            <h2>
                Beauty AI กำลังวิเคราะห์...
            </h2>

            <p>
                กำลังวิเคราะห์สไตล์ที่เหมาะกับคุณ
            </p>

        </div>

    `;


    try {

        // ส่งข้อมูลไป Server

        const response = await fetch(
            "/api/analyze",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    age: age,

                    skin: skin,

                    face: face,

                    style: style,

                    hair: selectedHair || "ไม่ได้เลือก"

                })

            }
        );


        const data =
            await response.json();


        // ตรวจสอบ Error

        if (!response.ok) {

            throw new Error(
                data.error || "เกิดข้อผิดพลาด"
            );

        }


        // แสดงผลลัพธ์แบบใหม่

        result.innerHTML = `

            <div class="beauty-result">

                <!-- หัวข้อ -->

                <div class="result-header">

                    <span class="badge">
                        ✨ BEAUTY AI RESULT
                    </span>

                    <h2>
                        ผลการวิเคราะห์ของคุณ
                    </h2>

                    <p>
                        Beauty AI วิเคราะห์สไตล์
                        ที่เหมาะกับคุณเรียบร้อยแล้ว
                    </p>

                </div>


                <!-- ข้อมูลผู้ใช้ -->

                <div class="user-summary">

                    <div class="summary-item">

                        <span>👤</span>

                        <div>
                            <small>อายุ</small>
                            <strong>${age} ปี</strong>
                        </div>

                    </div>


                    <div class="summary-item">

                        <span>🧴</span>

                        <div>
                            <small>สภาพผิว</small>
                            <strong>${skin}</strong>
                        </div>

                    </div>


                    <div class="summary-item">

                        <span>🌸</span>

                        <div>
                            <small>รูปหน้า</small>
                            <strong>${face}</strong>
                        </div>

                    </div>


                    <div class="summary-item">

                        <span>🎀</span>

                        <div>
                            <small>สไตล์</small>
                            <strong>${style}</strong>
                        </div>

                    </div>

                </div>


                <!-- ทรงผม -->

                <div class="result-section hair-result">

                    <div class="result-section-icon">
                        💇‍♀️
                    </div>

                    <div>

                        <h3>
                            ทรงผมที่เลือก
                        </h3>

                        <p>
                            ${selectedHair || "ไม่ได้เลือก"}
                        </p>

                    </div>

                </div>


                <!-- คำแนะนำจาก AI -->

                <div class="ai-result-container">

                    <div class="ai-title">

                        <span>
                            ✨
                        </span>

                        <h3>
                            คำแนะนำจาก Beauty AI
                        </h3>

                    </div>


                    <div class="ai-result">

                        ${formatAIResponse(data.result)}

                    </div>

                </div>


                <!-- ปุ่มวิเคราะห์ใหม่ -->

                <div class="result-actions">

                    <button
                        class="retry-button"
                        onclick="resetAnalysis()"
                    >
                        🔄 วิเคราะห์ใหม่
                    </button>

                    <button
                        class="home-button"
                        onclick="goHome()"
                    >
                        🏠 กลับหน้าหลัก
                    </button>

                </div>

            </div>

        `;


        // เลื่อนลงมาที่ผลลัพธ์

        document.getElementById("result")
            .scrollIntoView({
                behavior: "smooth"
            });


    } catch (error) {

        console.error(error);


        result.innerHTML = `

            <div class="error-box">

                ❌ ไม่สามารถเชื่อมต่อ Beauty AI ได้

                <br><br>

                ${error.message}

            </div>

        `;

    }

}


// ========================================
// จัดรูปแบบข้อความ AI
// ========================================

function formatAIResponse(text) {

    return text

        .replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        )

        .replace(
            /\n/g,
            "<br>"
        );

}


// ========================================
// วิเคราะห์ใหม่
// ========================================

function resetAnalysis() {

    document.getElementById("age").value = "";

    document.getElementById("skin").value = "";

    document.getElementById("face").value = "";

    document.getElementById("style").value = "";


    selectedHair = "";


    // เอากรอบออกจากทรงผม

    document.querySelectorAll(".hair-card")
        .forEach(function(card) {

            card.classList.remove("selected");

        });


    // ล้างผลลัพธ์

    document.getElementById("result").innerHTML = "";

    document.getElementById("selected-hair-result").innerHTML = "";


    // กลับขึ้นด้านบน

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ========================================
// กลับหน้าหลัก
// ========================================

function goHome() {

    window.location.href = "index.html";

}