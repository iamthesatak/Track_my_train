# Indian Railway Stations Database
# Contains major stations with GPS coordinates, zone info, and platform counts

stations = [
    # Northern Railway (NR)
    {"code": "NDLS", "name": "New Delhi", "city": "New Delhi", "state": "Delhi", "zone": "NR", "lat": 28.6424, "lng": 77.2196, "platforms": 16},
    {"code": "DLI", "name": "Old Delhi", "city": "Delhi", "state": "Delhi", "zone": "NR", "lat": 28.6608, "lng": 77.2282, "platforms": 16},
    {"code": "NZM", "name": "Hazrat Nizamuddin", "city": "New Delhi", "state": "Delhi", "zone": "NR", "lat": 28.5891, "lng": 77.2538, "platforms": 7},
    {"code": "ANVT", "name": "Anand Vihar Terminal", "city": "New Delhi", "state": "Delhi", "zone": "NR", "lat": 28.6467, "lng": 77.3156, "platforms": 7},
    {"code": "GZB", "name": "Ghaziabad", "city": "Ghaziabad", "state": "UP", "zone": "NR", "lat": 28.6611, "lng": 77.4328, "platforms": 7},
    {"code": "AGC", "name": "Agra Cantt", "city": "Agra", "state": "UP", "zone": "NCR", "lat": 27.1553, "lng": 78.0093, "platforms": 7},
    {"code": "MTJ", "name": "Mathura Jn", "city": "Mathura", "state": "UP", "zone": "NCR", "lat": 27.4851, "lng": 77.6712, "platforms": 8},
    {"code": "LKO", "name": "Lucknow Charbagh", "city": "Lucknow", "state": "UP", "zone": "NR", "lat": 26.8320, "lng": 80.9170, "platforms": 9},
    {"code": "CNB", "name": "Kanpur Central", "city": "Kanpur", "state": "UP", "zone": "NCR", "lat": 26.4494, "lng": 80.3510, "platforms": 10},
    {"code": "ALD", "name": "Prayagraj Jn", "city": "Prayagraj", "state": "UP", "zone": "NCR", "lat": 25.4277, "lng": 81.8310, "platforms": 10},
    {"code": "BSB", "name": "Varanasi Jn", "city": "Varanasi", "state": "UP", "zone": "NR", "lat": 25.3175, "lng": 82.9884, "platforms": 9},
    {"code": "GKP", "name": "Gorakhpur Jn", "city": "Gorakhpur", "state": "UP", "zone": "NER", "lat": 26.7510, "lng": 83.3641, "platforms": 10},
    {"code": "MB", "name": "Moradabad", "city": "Moradabad", "state": "UP", "zone": "NR", "lat": 28.8444, "lng": 78.7709, "platforms": 6},
    {"code": "BE", "name": "Bareilly Jn", "city": "Bareilly", "state": "UP", "zone": "NR", "lat": 28.3500, "lng": 79.4110, "platforms": 6},
    {"code": "JHS", "name": "Jhansi Jn", "city": "Jhansi", "state": "UP", "zone": "NCR", "lat": 25.4437, "lng": 78.5685, "platforms": 8},
    {"code": "CDG", "name": "Chandigarh", "city": "Chandigarh", "state": "Chandigarh", "zone": "NR", "lat": 30.6884, "lng": 76.8021, "platforms": 6},
    {"code": "UMB", "name": "Ambala Cantt", "city": "Ambala", "state": "Haryana", "zone": "NR", "lat": 30.3598, "lng": 76.8426, "platforms": 8},
    {"code": "LDH", "name": "Ludhiana Jn", "city": "Ludhiana", "state": "Punjab", "zone": "NR", "lat": 30.9104, "lng": 75.8520, "platforms": 6},
    {"code": "ASR", "name": "Amritsar Jn", "city": "Amritsar", "state": "Punjab", "zone": "NR", "lat": 31.6370, "lng": 74.8680, "platforms": 6},
    {"code": "JAT", "name": "Jammu Tawi", "city": "Jammu", "state": "J&K", "zone": "NR", "lat": 32.7332, "lng": 74.8667, "platforms": 6},
    {"code": "DDN", "name": "Dehradun", "city": "Dehradun", "state": "Uttarakhand", "zone": "NR", "lat": 30.3190, "lng": 78.0410, "platforms": 5},
    {"code": "HW", "name": "Haridwar Jn", "city": "Haridwar", "state": "Uttarakhand", "zone": "NR", "lat": 29.9209, "lng": 78.1330, "platforms": 6},

    # Western Railway (WR)
    {"code": "BCT", "name": "Mumbai Central", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 18.9694, "lng": 72.8197, "platforms": 5},
    {"code": "BVI", "name": "Borivali", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 19.2287, "lng": 72.8569, "platforms": 4},
    {"code": "BRC", "name": "Vadodara Jn", "city": "Vadodara", "state": "Gujarat", "zone": "WR", "lat": 22.3105, "lng": 73.1816, "platforms": 7},
    {"code": "ST", "name": "Surat", "city": "Surat", "state": "Gujarat", "zone": "WR", "lat": 21.2043, "lng": 72.8412, "platforms": 6},
    {"code": "ADI", "name": "Ahmedabad Jn", "city": "Ahmedabad", "state": "Gujarat", "zone": "WR", "lat": 23.0277, "lng": 72.6003, "platforms": 12},
    {"code": "JP", "name": "Jaipur Jn", "city": "Jaipur", "state": "Rajasthan", "zone": "NWR", "lat": 26.9186, "lng": 75.7816, "platforms": 6},
    {"code": "AII", "name": "Ajmer Jn", "city": "Ajmer", "state": "Rajasthan", "zone": "NWR", "lat": 26.4516, "lng": 74.6346, "platforms": 5},
    {"code": "UDZ", "name": "Udaipur City", "city": "Udaipur", "state": "Rajasthan", "zone": "NWR", "lat": 24.5792, "lng": 73.6840, "platforms": 4},
    {"code": "JU", "name": "Jodhpur Jn", "city": "Jodhpur", "state": "Rajasthan", "zone": "NWR", "lat": 26.2880, "lng": 73.0204, "platforms": 6},

    # Central Railway (CR)
    {"code": "CSMT", "name": "Chhatrapati Shivaji Maharaj Terminus", "city": "Mumbai", "state": "Maharashtra", "zone": "CR", "lat": 18.9402, "lng": 72.8356, "platforms": 18},
    {"code": "LTT", "name": "Lokmanya Tilak Terminus", "city": "Mumbai", "state": "Maharashtra", "zone": "CR", "lat": 19.0680, "lng": 72.8876, "platforms": 9},
    {"code": "DR", "name": "Dadar", "city": "Mumbai", "state": "Maharashtra", "zone": "CR", "lat": 19.0185, "lng": 72.8430, "platforms": 8},
    {"code": "KYN", "name": "Kalyan Jn", "city": "Kalyan", "state": "Maharashtra", "zone": "CR", "lat": 19.2330, "lng": 73.1317, "platforms": 8},
    {"code": "PUNE", "name": "Pune Jn", "city": "Pune", "state": "Maharashtra", "zone": "CR", "lat": 18.5285, "lng": 73.8739, "platforms": 6},
    {"code": "NGP", "name": "Nagpur Jn", "city": "Nagpur", "state": "Maharashtra", "zone": "CR", "lat": 21.1500, "lng": 79.0872, "platforms": 8},
    {"code": "BSL", "name": "Bhusaval Jn", "city": "Bhusaval", "state": "Maharashtra", "zone": "CR", "lat": 21.0505, "lng": 75.7833, "platforms": 7},
    {"code": "SUR", "name": "Solapur Jn", "city": "Solapur", "state": "Maharashtra", "zone": "CR", "lat": 17.6723, "lng": 75.9113, "platforms": 5},
    {"code": "NSK", "name": "Nashik Road", "city": "Nashik", "state": "Maharashtra", "zone": "CR", "lat": 19.9802, "lng": 73.8116, "platforms": 4},

    # Eastern Railway (ER)
    {"code": "HWH", "name": "Howrah Jn", "city": "Howrah", "state": "West Bengal", "zone": "ER", "lat": 22.5843, "lng": 88.3428, "platforms": 23},
    {"code": "SDAH", "name": "Sealdah", "city": "Kolkata", "state": "West Bengal", "zone": "ER", "lat": 22.5655, "lng": 88.3742, "platforms": 20},
    {"code": "KOAA", "name": "Kolkata", "city": "Kolkata", "state": "West Bengal", "zone": "ER", "lat": 22.5362, "lng": 88.3577, "platforms": 6},
    {"code": "NJP", "name": "New Jalpaiguri", "city": "Siliguri", "state": "West Bengal", "zone": "NFR", "lat": 26.7099, "lng": 88.4316, "platforms": 8},
    {"code": "ASN", "name": "Asansol Jn", "city": "Asansol", "state": "West Bengal", "zone": "ER", "lat": 23.6847, "lng": 86.9443, "platforms": 7},

    # South Eastern Railway (SER)
    {"code": "KGP", "name": "Kharagpur Jn", "city": "Kharagpur", "state": "West Bengal", "zone": "SER", "lat": 22.3454, "lng": 87.3194, "platforms": 8},
    {"code": "BBS", "name": "Bhubaneswar", "city": "Bhubaneswar", "state": "Odisha", "zone": "ECoR", "lat": 20.2711, "lng": 85.8430, "platforms": 6},
    {"code": "PURI", "name": "Puri", "city": "Puri", "state": "Odisha", "zone": "ECoR", "lat": 19.8050, "lng": 85.8264, "platforms": 7},
    {"code": "VSKP", "name": "Visakhapatnam Jn", "city": "Visakhapatnam", "state": "AP", "zone": "ECoR", "lat": 17.7201, "lng": 83.2512, "platforms": 8},
    {"code": "RNC", "name": "Ranchi", "city": "Ranchi", "state": "Jharkhand", "zone": "SER", "lat": 23.3145, "lng": 85.3220, "platforms": 6},
    {"code": "TATA", "name": "Tatanagar Jn", "city": "Jamshedpur", "state": "Jharkhand", "zone": "SER", "lat": 22.7871, "lng": 86.1521, "platforms": 6},

    # Southern Railway (SR)
    {"code": "MAS", "name": "Chennai Central", "city": "Chennai", "state": "Tamil Nadu", "zone": "SR", "lat": 13.0833, "lng": 80.2753, "platforms": 12},
    {"code": "MS", "name": "Chennai Egmore", "city": "Chennai", "state": "Tamil Nadu", "zone": "SR", "lat": 13.0737, "lng": 80.2609, "platforms": 11},
    {"code": "MDU", "name": "Madurai Jn", "city": "Madurai", "state": "Tamil Nadu", "zone": "SR", "lat": 9.9199, "lng": 78.1202, "platforms": 6},
    {"code": "TVC", "name": "Thiruvananthapuram Central", "city": "Thiruvananthapuram", "state": "Kerala", "zone": "SR", "lat": 8.4893, "lng": 76.9513, "platforms": 5},
    {"code": "ERS", "name": "Ernakulam Jn", "city": "Kochi", "state": "Kerala", "zone": "SR", "lat": 9.9837, "lng": 76.2899, "platforms": 6},
    {"code": "CLT", "name": "Kozhikode", "city": "Kozhikode", "state": "Kerala", "zone": "SR", "lat": 11.2459, "lng": 75.7744, "platforms": 5},
    {"code": "MAQ", "name": "Mangaluru Central", "city": "Mangaluru", "state": "Karnataka", "zone": "SR", "lat": 12.8620, "lng": 74.8369, "platforms": 4},
    {"code": "CBE", "name": "Coimbatore Jn", "city": "Coimbatore", "state": "Tamil Nadu", "zone": "SR", "lat": 11.0019, "lng": 76.9639, "platforms": 6},
    {"code": "SA", "name": "Salem Jn", "city": "Salem", "state": "Tamil Nadu", "zone": "SR", "lat": 11.6558, "lng": 78.1414, "platforms": 6},
    {"code": "TPJ", "name": "Tiruchirappalli Jn", "city": "Tiruchirappalli", "state": "Tamil Nadu", "zone": "SR", "lat": 10.8153, "lng": 78.6928, "platforms": 7},

    # South Central Railway (SCR)
    {"code": "SC", "name": "Secunderabad Jn", "city": "Hyderabad", "state": "Telangana", "zone": "SCR", "lat": 17.4344, "lng": 78.5013, "platforms": 10},
    {"code": "HYB", "name": "Hyderabad Deccan", "city": "Hyderabad", "state": "Telangana", "zone": "SCR", "lat": 17.3850, "lng": 78.4867, "platforms": 4},
    {"code": "KCG", "name": "Kachiguda", "city": "Hyderabad", "state": "Telangana", "zone": "SCR", "lat": 17.3653, "lng": 78.4975, "platforms": 5},
    {"code": "TPTY", "name": "Tirupati", "city": "Tirupati", "state": "AP", "zone": "SCR", "lat": 13.6334, "lng": 79.4101, "platforms": 5},
    {"code": "BZA", "name": "Vijayawada Jn", "city": "Vijayawada", "state": "AP", "zone": "SCR", "lat": 16.5157, "lng": 80.6202, "platforms": 10},
    {"code": "WL", "name": "Warangal", "city": "Warangal", "state": "Telangana", "zone": "SCR", "lat": 17.9689, "lng": 79.5941, "platforms": 5},
    {"code": "GNT", "name": "Guntur Jn", "city": "Guntur", "state": "AP", "zone": "SCR", "lat": 16.3109, "lng": 80.4365, "platforms": 5},

    # South Western Railway (SWR)
    {"code": "SBC", "name": "KSR Bengaluru", "city": "Bengaluru", "state": "Karnataka", "zone": "SWR", "lat": 12.9776, "lng": 77.5713, "platforms": 10},
    {"code": "YPR", "name": "Yesvantpur Jn", "city": "Bengaluru", "state": "Karnataka", "zone": "SWR", "lat": 13.0266, "lng": 77.5537, "platforms": 7},
    {"code": "MYS", "name": "Mysuru Jn", "city": "Mysuru", "state": "Karnataka", "zone": "SWR", "lat": 12.3029, "lng": 76.6545, "platforms": 6},
    {"code": "UBL", "name": "Hubballi Jn", "city": "Hubballi", "state": "Karnataka", "zone": "SWR", "lat": 15.3362, "lng": 75.1049, "platforms": 6},
    {"code": "GTL", "name": "Guntakal Jn", "city": "Guntakal", "state": "AP", "zone": "SCR", "lat": 15.1669, "lng": 77.3795, "platforms": 6},

    # East Central Railway (ECR)
    {"code": "PNBE", "name": "Patna Jn", "city": "Patna", "state": "Bihar", "zone": "ECR", "lat": 25.6079, "lng": 85.1361, "platforms": 10},
    {"code": "MGS", "name": "Mughal Sarai Jn", "city": "Mughal Sarai", "state": "UP", "zone": "ECR", "lat": 25.2810, "lng": 83.1190, "platforms": 10},
    {"code": "GAYA", "name": "Gaya Jn", "city": "Gaya", "state": "Bihar", "zone": "ECR", "lat": 24.7915, "lng": 85.0003, "platforms": 7},
    {"code": "DHN", "name": "Dhanbad Jn", "city": "Dhanbad", "state": "Jharkhand", "zone": "ECR", "lat": 23.7908, "lng": 86.4290, "platforms": 8},

    # West Central Railway (WCR)
    {"code": "BPL", "name": "Bhopal Jn", "city": "Bhopal", "state": "MP", "zone": "WCR", "lat": 23.2687, "lng": 77.4122, "platforms": 6},
    {"code": "JBP", "name": "Jabalpur Jn", "city": "Jabalpur", "state": "MP", "zone": "WCR", "lat": 23.1688, "lng": 79.9495, "platforms": 6},
    {"code": "ET", "name": "Itarsi Jn", "city": "Itarsi", "state": "MP", "zone": "WCR", "lat": 22.6165, "lng": 77.7727, "platforms": 7},
    {"code": "GWL", "name": "Gwalior Jn", "city": "Gwalior", "state": "MP", "zone": "NCR", "lat": 26.2143, "lng": 78.1808, "platforms": 5},
    {"code": "INDB", "name": "Indore Jn", "city": "Indore", "state": "MP", "zone": "WR", "lat": 22.7212, "lng": 75.8054, "platforms": 5},

    # Northeast Frontier Railway (NFR)
    {"code": "GHY", "name": "Guwahati", "city": "Guwahati", "state": "Assam", "zone": "NFR", "lat": 26.1747, "lng": 91.7532, "platforms": 7},

    # Konkan Railway
    {"code": "MAO", "name": "Madgaon Jn", "city": "Margao", "state": "Goa", "zone": "KR", "lat": 15.2756, "lng": 73.9551, "platforms": 3},
    {"code": "RN", "name": "Ratnagiri", "city": "Ratnagiri", "state": "Maharashtra", "zone": "KR", "lat": 16.9884, "lng": 73.3185, "platforms": 3},
    {"code": "PNVL", "name": "Panvel", "city": "Panvel", "state": "Maharashtra", "zone": "CR", "lat": 18.9918, "lng": 73.1137, "platforms": 4},

    # Additional key junctions
    {"code": "RU", "name": "Raipur Jn", "city": "Raipur", "state": "Chhattisgarh", "zone": "SECR", "lat": 21.2320, "lng": 81.6275, "platforms": 6},
    {"code": "BPQ", "name": "Balharshah", "city": "Balharshah", "state": "Maharashtra", "zone": "SCR", "lat": 19.8585, "lng": 79.3512, "platforms": 5},
    {"code": "KZJ", "name": "Kazipet Jn", "city": "Kazipet", "state": "Telangana", "zone": "SCR", "lat": 17.9850, "lng": 79.5456, "platforms": 5},
    {"code": "KUR", "name": "Khurda Road Jn", "city": "Khurda", "state": "Odisha", "zone": "ECoR", "lat": 20.1848, "lng": 85.6240, "platforms": 5},
    {"code": "BAM", "name": "Barauni Jn", "city": "Barauni", "state": "Bihar", "zone": "ECR", "lat": 25.4623, "lng": 86.1200, "platforms": 6},
    {"code": "SPJ", "name": "Samastipur Jn", "city": "Samastipur", "state": "Bihar", "zone": "ECR", "lat": 25.8599, "lng": 85.7856, "platforms": 5},
    {"code": "KIR", "name": "Katihar Jn", "city": "Katihar", "state": "Bihar", "zone": "NFR", "lat": 25.5536, "lng": 87.5616, "platforms": 6},

    # === SUBURBAN / LOCAL STATIONS ===

    # Mumbai Western Line (Churchgate → Virar)
    {"code": "CCG", "name": "Churchgate", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 18.9353, "lng": 72.8274, "platforms": 4},
    {"code": "MR", "name": "Marine Lines", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 18.9440, "lng": 72.8234, "platforms": 2},
    {"code": "SD", "name": "Charni Road", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 18.9520, "lng": 72.8198, "platforms": 2},
    {"code": "GR", "name": "Grant Road", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 18.9632, "lng": 72.8173, "platforms": 2},
    {"code": "BA", "name": "Mumbai Central Local", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 18.9694, "lng": 72.8197, "platforms": 4},
    {"code": "DRD", "name": "Dadar Western", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 19.0185, "lng": 72.8428, "platforms": 4},
    {"code": "AND", "name": "Andheri", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 19.1197, "lng": 72.8464, "platforms": 4},
    {"code": "JOG", "name": "Jogeshwari", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 19.1359, "lng": 72.8492, "platforms": 2},
    {"code": "GOA", "name": "Goregaon", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 19.1663, "lng": 72.8494, "platforms": 2},
    {"code": "MIR", "name": "Mira Road", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 19.2814, "lng": 72.8687, "platforms": 2},
    {"code": "BYR", "name": "Bhayandar", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 19.3012, "lng": 72.8512, "platforms": 2},
    {"code": "NSP", "name": "Nallasopara", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 19.4168, "lng": 72.8280, "platforms": 2},
    {"code": "VR", "name": "Vasai Road", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 19.3660, "lng": 72.8347, "platforms": 4},
    {"code": "VIR", "name": "Virar", "city": "Mumbai", "state": "Maharashtra", "zone": "WR", "lat": 19.4558, "lng": 72.8113, "platforms": 4},

    # Mumbai Central Line (CSMT → Thane → Kalyan → beyond)
    {"code": "BY", "name": "Byculla", "city": "Mumbai", "state": "Maharashtra", "zone": "CR", "lat": 18.9780, "lng": 72.8330, "platforms": 4},
    {"code": "CLA", "name": "Currey Road", "city": "Mumbai", "state": "Maharashtra", "zone": "CR", "lat": 18.9942, "lng": 72.8383, "platforms": 2},
    {"code": "GTN", "name": "Ghatkopar", "city": "Mumbai", "state": "Maharashtra", "zone": "CR", "lat": 19.0860, "lng": 72.9080, "platforms": 4},
    {"code": "MUL", "name": "Mulund", "city": "Mumbai", "state": "Maharashtra", "zone": "CR", "lat": 19.1726, "lng": 72.9569, "platforms": 4},
    {"code": "TNA", "name": "Thane", "city": "Thane", "state": "Maharashtra", "zone": "CR", "lat": 19.1854, "lng": 72.9751, "platforms": 8},
    {"code": "DI", "name": "Diva Jn", "city": "Thane", "state": "Maharashtra", "zone": "CR", "lat": 19.1891, "lng": 73.0286, "platforms": 6},
    {"code": "DKDI", "name": "Dombivli", "city": "Thane", "state": "Maharashtra", "zone": "CR", "lat": 19.2183, "lng": 73.0867, "platforms": 4},
    {"code": "ABH", "name": "Ambernath", "city": "Thane", "state": "Maharashtra", "zone": "CR", "lat": 19.1866, "lng": 73.1878, "platforms": 2},
    {"code": "BUD", "name": "Badlapur", "city": "Thane", "state": "Maharashtra", "zone": "CR", "lat": 19.1612, "lng": 73.2352, "platforms": 2},
    {"code": "KSR", "name": "Kasara", "city": "Thane", "state": "Maharashtra", "zone": "CR", "lat": 19.6320, "lng": 73.4741, "platforms": 3},

    # Mumbai Harbour Line (CSMT → Panvel)
    {"code": "SNRD", "name": "Sandhurst Road", "city": "Mumbai", "state": "Maharashtra", "zone": "CR", "lat": 18.9655, "lng": 72.8400, "platforms": 2},
    {"code": "WB", "name": "Wadala Road", "city": "Mumbai", "state": "Maharashtra", "zone": "CR", "lat": 19.0196, "lng": 72.8580, "platforms": 2},
    {"code": "CSD", "name": "Chembur", "city": "Mumbai", "state": "Maharashtra", "zone": "CR", "lat": 19.0580, "lng": 72.8994, "platforms": 2},
    {"code": "VAS", "name": "Vashi", "city": "Navi Mumbai", "state": "Maharashtra", "zone": "CR", "lat": 19.0652, "lng": 73.0015, "platforms": 2},
    {"code": "NRI", "name": "Nerul", "city": "Navi Mumbai", "state": "Maharashtra", "zone": "CR", "lat": 19.0330, "lng": 73.0193, "platforms": 2},
    {"code": "BE", "name": "Belapur CBD", "city": "Navi Mumbai", "state": "Maharashtra", "zone": "CR", "lat": 19.0225, "lng": 73.0400, "platforms": 2},

    # Kolkata Suburban
    {"code": "DH", "name": "Dum Dum Jn", "city": "Kolkata", "state": "West Bengal", "zone": "ER", "lat": 22.6227, "lng": 88.4233, "platforms": 4},
    {"code": "BRR", "name": "Barrackpore", "city": "Kolkata", "state": "West Bengal", "zone": "ER", "lat": 22.7649, "lng": 88.3765, "platforms": 2},
    {"code": "NH", "name": "Naihati Jn", "city": "Naihati", "state": "West Bengal", "zone": "ER", "lat": 22.8929, "lng": 88.4219, "platforms": 4},
    {"code": "BDC", "name": "Bandel Jn", "city": "Bandel", "state": "West Bengal", "zone": "ER", "lat": 22.9332, "lng": 88.3831, "platforms": 6},
    {"code": "RNG", "name": "Ranaghat Jn", "city": "Ranaghat", "state": "West Bengal", "zone": "ER", "lat": 23.1801, "lng": 88.5843, "platforms": 6},
    {"code": "BWN", "name": "Barddhaman Jn", "city": "Barddhaman", "state": "West Bengal", "zone": "ER", "lat": 23.2545, "lng": 87.8566, "platforms": 7},
    {"code": "KWAE", "name": "Katwa Jn", "city": "Katwa", "state": "West Bengal", "zone": "ER", "lat": 23.6493, "lng": 88.1306, "platforms": 5},
    {"code": "BLY", "name": "Ballygunge Jn", "city": "Kolkata", "state": "West Bengal", "zone": "ER", "lat": 22.5270, "lng": 88.3646, "platforms": 4},
    {"code": "SPR", "name": "Sonarpur Jn", "city": "Kolkata", "state": "West Bengal", "zone": "ER", "lat": 22.4498, "lng": 88.4190, "platforms": 4},
    {"code": "CGR", "name": "Canning", "city": "Canning", "state": "West Bengal", "zone": "ER", "lat": 22.3122, "lng": 88.6535, "platforms": 2},

    # Chennai Suburban
    {"code": "MSB", "name": "Chennai Beach", "city": "Chennai", "state": "Tamil Nadu", "zone": "SR", "lat": 13.0988, "lng": 80.2939, "platforms": 5},
    {"code": "PER", "name": "Perambur", "city": "Chennai", "state": "Tamil Nadu", "zone": "SR", "lat": 13.1087, "lng": 80.2424, "platforms": 3},
    {"code": "TI", "name": "Tiruvallur", "city": "Tiruvallur", "state": "Tamil Nadu", "zone": "SR", "lat": 13.1433, "lng": 79.9101, "platforms": 2},
    {"code": "MNDY", "name": "Mambalam", "city": "Chennai", "state": "Tamil Nadu", "zone": "SR", "lat": 13.0389, "lng": 80.2227, "platforms": 2},
    {"code": "CMP", "name": "Chromepet", "city": "Chennai", "state": "Tamil Nadu", "zone": "SR", "lat": 12.9497, "lng": 80.1413, "platforms": 2},
    {"code": "TBM", "name": "Tambaram", "city": "Chennai", "state": "Tamil Nadu", "zone": "SR", "lat": 12.9250, "lng": 80.1168, "platforms": 4},
    {"code": "CGL", "name": "Chengalpattu Jn", "city": "Chengalpattu", "state": "Tamil Nadu", "zone": "SR", "lat": 12.6930, "lng": 79.9762, "platforms": 5},
    {"code": "AVD", "name": "Avadi", "city": "Chennai", "state": "Tamil Nadu", "zone": "SR", "lat": 13.1143, "lng": 80.0979, "platforms": 2},
    {"code": "VLY", "name": "Velachery", "city": "Chennai", "state": "Tamil Nadu", "zone": "SR", "lat": 12.9815, "lng": 80.2180, "platforms": 2},
    {"code": "GDY", "name": "Guindy", "city": "Chennai", "state": "Tamil Nadu", "zone": "SR", "lat": 13.0094, "lng": 80.2128, "platforms": 2},

    # Katwa - Bardhaman Local (ER)
    {"code": "BWN", "name": "Barddhaman Jn", "city": "Bardhaman", "state": "West Bengal", "zone": "ER", "lat": 23.2323, "lng": 87.8643, "platforms": 8},
    {"code": "KMRA", "name": "Kamnara", "city": "Bardhaman", "state": "West Bengal", "zone": "ER", "lat": 23.2676, "lng": 87.8765, "platforms": 2},
    {"code": "KSHT", "name": "Kshetia", "city": "Bardhaman", "state": "West Bengal", "zone": "ER", "lat": 23.3102, "lng": 87.8931, "platforms": 2},
    {"code": "CMD", "name": "Chamardighi", "city": "Bardhaman", "state": "West Bengal", "zone": "ER", "lat": 23.3501, "lng": 87.9102, "platforms": 2},
    {"code": "KJRA", "name": "Karjana", "city": "Bardhaman", "state": "West Bengal", "zone": "ER", "lat": 23.3854, "lng": 87.9250, "platforms": 2},
    {"code": "BGNA", "name": "Balgona", "city": "Bardhaman", "state": "West Bengal", "zone": "ER", "lat": 23.4215, "lng": 87.9402, "platforms": 3},
    {"code": "KWAE", "name": "Katwa Jn", "city": "Katwa", "state": "West Bengal", "zone": "ER", "lat": 23.6444, "lng": 88.1311, "platforms": 5},
]

# Build lookup dictionary
_station_map = {s["code"]: s for s in stations}


def find_station(code: str):
    """Find station by code."""
    return _station_map.get(code)


def search_stations(query: str, limit: int = 20):
    """Search stations by code, name, or city."""
    q = query.lower()
    results = [
        s for s in stations
        if q in s["code"].lower()
        or q in s["name"].lower()
        or q in s["city"].lower()
    ]
    return results[:limit]


def get_all_station_codes():
    """Get all station codes."""
    return list(_station_map.keys())
