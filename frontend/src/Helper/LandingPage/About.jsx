export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
      <div className="bg-white max-w-6xl w-full rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">

        
        {/* LEFT CONTENT */}
        <div className="w-full md:w-2/3 px-6 md:px-12 py-8 md:py-12 flex flex-col justify-between">
          <div>
            <h2 className="text-orange-500 text-3xl font-serif mb-4">
              Birsa Munda
            </h2>

            <p className="font-semibold text-lg mb-6">
              Indian tribal leader
            </p>

            <p className="text-gray-700 leading-relaxed text-base">
              Birsa Munda was a 19th-century Indian tribal leader, freedom fighter, and folk hero known for leading the Munda Rebellion against British rule in the Chotanagpur Plateau region. He was born in 1875 and died at the age of 25 in 1900 while imprisoned. Munda advocated for tribal rights, cultural identity, and land ownership, and his movement, the 'Ulgulan', fought against oppression from landlords and the British.
              <br /><br />
              Birsa Munda was born on 15 November 1875, at the village of Ulihatu in Ranchi district of Bengal Presidency – now in Khunti district of Jharkhand. Ulihatu was the birthplace of Sugana Munda, father of Birsa. The claim of Ulihatu rests on Birsa's elder brother Komta Munda living in the village, where his house still exists albeit in a dilapidated condition.
              <br /><br />
              Birsa received his education in Salga under the guidance of his teacher Jaipal Nag. Later, Birsa converted to Christianity to join the German Mission School. After dropping out of school, Birsa Munda created a faith called Birsait.<a href="https://en.wikipedia.org/wiki/Birsa_Munda" className="text-blue-500">read more...</a>
            </p>
          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="md:w-1/3 relative w-full">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsoiNar2DzIuaStkD6XTWPR2MSDAJmbtcqeOosBbUW4DKAnbtQ1lgNXsDW5IbZlItLRJUpB_SdMLBheQAKjx11sSNz8rpCpnyv_HPz_Lg1&s=10"
            alt="Minister"
            className="h-full w-full object-cover"
          />
        </div>

      </div>
    </div>
  );
}
