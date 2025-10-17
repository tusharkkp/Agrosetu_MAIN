import React, { useState, useRef } from "react";
import { Camera, Upload, Search, Bug, AlertTriangle, CheckCircle, Clock, MapPin, Globe, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { pestDetectionApi, PestDetectionResponse, FeedbackRequest } from "@/lib/pestDetectionApi";
import { toast } from "sonner";

const PestDetection = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State management
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropType, setCropType] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("English");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PestDetectionResponse | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [feedback, setFeedback] = useState<{ rating: string; comment: string }>({ rating: "Helpful", comment: "" });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const detectionMethods = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: t('pest.methods.photo'),
      description: t('pest.methods.photoDesc'),
      accuracy: "95%"
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: t('pest.methods.upload'),
      description: t('pest.methods.uploadDesc'),
      accuracy: "92%"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: t('pest.methods.search'),
      description: t('pest.methods.searchDesc'),
      accuracy: "88%"
    }
  ];

  const commonPests = [
    {
      name: t('pest.common.aphids'),
      description: t('pest.common.aphidsDesc'),
      symptoms: t('pest.common.aphidsSymptoms').split(', '),
      treatment: t('pest.common.aphidsTreatment')
    },
    {
      name: t('pest.common.whiteflies'),
      description: t('pest.common.whitefliesDesc'),
      symptoms: t('pest.common.whitefliesSymptoms').split(', '),
      treatment: t('pest.common.whitefliesTreatment')
    },
    {
      name: t('pest.common.spiderMites'),
      description: t('pest.common.spiderMitesDesc'),
      symptoms: t('pest.common.spiderMitesSymptoms').split(', '),
      treatment: t('pest.common.spiderMitesTreatment')
    },
    {
      name: t('pest.common.thrips'),
      description: t('pest.common.thripsDesc'),
      symptoms: t('pest.common.thripsSymptoms').split(', '),
      treatment: t('pest.common.thripsTreatment')
    }
  ];

  // Image handling functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setShowCamera(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      toast.error("Unable to access camera. Please try uploading an image instead.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageData);
        setShowCamera(false);
        
        // Stop camera
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setShowCamera(false);
    }
  };

  // Analysis function
  const analyzeImage = async () => {
    if (!selectedImage) {
      toast.error(t('pest.errors.noImage'));
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await pestDetectionApi.detectPest({
        image: selectedImage,
        cropType,
        location,
        language
      });

      if (response.success) {
        setAnalysisResult(response);
        toast.success("Analysis completed successfully!");
      } else {
        toast.error(response.error || t('pest.errors.analysisFailed'));
      }
    } catch (error) {
      toast.error(t('pest.errors.networkError'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Feedback submission
  const submitFeedback = async () => {
    if (!analysisResult) return;

    setIsSubmittingFeedback(true);
    try {
      const feedbackRequest: FeedbackRequest = {
        feedback: feedback.rating as "Helpful" | "Not Accurate" | "Partially Helpful",
        comment: feedback.comment
      };

      const response = await pestDetectionApi.submitFeedback(feedbackRequest);
      if (response.success) {
        toast.success(response.message);
        setFeedback({ rating: "Helpful", comment: "" });
      } else {
        toast.error(response.error || "Failed to submit feedback");
      }
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Reset function
  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setCropType("");
    setLocation("");
    setLanguage("English");
    setFeedback({ rating: "Helpful", comment: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'severe':
        return 'bg-red-500 text-white';
      case 'moderate':
        return 'bg-yellow-500 text-white';
      case 'mild':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-text-dark mb-6">
            {t('pest.title')}
          </h1>
          <p className="text-xl text-text-medium max-w-3xl mx-auto">
            {t('pest.subtitle')}
          </p>
        </div>

        {/* Detection Methods */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-text-dark mb-12 text-center">
            {t('pest.methods.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {detectionMethods.map((method, index) => (
              <div key={index} className="feature-card text-center">
                <div className="text-pear mb-6 flex justify-center">
                  {method.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  {method.title}
                </h3>
                <p className="text-text-medium mb-4">
                  {method.description}
                </p>
                <div className="inline-block px-4 py-2 bg-gradient-secondary text-white rounded-full font-semibold">
                  {method.accuracy} {t('pest.methods.accuracy')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Analysis Interface */}
        <section className="mb-20">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-text-dark text-center">
                <Bug className="w-8 h-8 inline mr-2" />
                {t('pest.detection.title')}
              </CardTitle>
              <CardDescription className="text-center text-text-medium">
                {t('pest.detection.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Form Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cropType">{t('pest.form.cropType')}</Label>
                  <Input
                    id="cropType"
                    placeholder={t('pest.form.cropTypePlaceholder')}
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">{t('pest.form.location')}</Label>
                  <Input
                    id="location"
                    placeholder={t('pest.form.locationPlaceholder')}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">{t('pest.form.language')}</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('pest.form.languagePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Telugu">Telugu</SelectItem>
                      <SelectItem value="Marathi">Marathi</SelectItem>
                      <SelectItem value="Punjabi">Punjabi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label>{t('pest.detection.uploadText')}</Label>
                
                {!showCamera && (
                  <div className="border-2 border-dashed border-pear rounded-xl p-8 text-center">
                    {selectedImage ? (
                      <div className="space-y-4">
                        <img 
                          src={selectedImage} 
                          alt="Selected crop" 
                          className="max-w-full max-h-64 mx-auto rounded-lg"
                        />
                        <div className="flex gap-2 justify-center">
                          <Button onClick={startCamera} variant="outline">
                            <Camera className="w-4 h-4 mr-2" />
                            {t('pest.detection.takePhoto')}
                          </Button>
                          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            {t('pest.detection.uploadImage')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="w-12 h-12 text-pear mx-auto" />
                        <p className="text-text-medium">{t('pest.detection.uploadText')}</p>
                        <div className="flex gap-2 justify-center">
                          <Button onClick={startCamera}>
                            <Camera className="w-4 h-4 mr-2" />
                            {t('pest.detection.takePhoto')}
                          </Button>
                          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            {t('pest.detection.uploadImage')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Camera Interface */}
                {showCamera && (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full max-w-md mx-auto rounded-lg"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="flex gap-2 justify-center">
                      <Button onClick={capturePhoto}>
                        <Camera className="w-4 h-4 mr-2" />
                        Capture Photo
                      </Button>
                      <Button onClick={stopCamera} variant="outline">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Analysis Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={analyzeImage}
                  disabled={!selectedImage || isAnalyzing}
                  className="btn-hero"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('pest.form.analyzing')}
                    </>
                  ) : (
                    t('pest.form.analyzeButton')
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Analysis Results */}
        {analysisResult && (
          <section className="mb-20">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-text-dark flex items-center">
                  <CheckCircle className="w-8 h-8 mr-2 text-green-500" />
                  {t('pest.results.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Severity Alert */}
                <Alert className={getSeverityColor(analysisResult.severity)}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="font-bold">
                    {t('pest.results.severity')}: {analysisResult.severity}
                    {analysisResult.severity === 'Severe' && ` - ${t('pest.results.urgent')}`}
                  </AlertDescription>
                </Alert>

                {/* Weather Information */}
                {analysisResult.weather && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-700">{analysisResult.weather}</span>
                  </div>
                )}

                {/* Detailed Analysis */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-text-dark flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    {t('pest.results.analysis')}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-text-medium whitespace-pre-line">
                      {analysisResult.analysis}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-center">
                  <Button onClick={resetAnalysis} variant="outline">
                    {t('pest.form.uploadAnotherButton')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Feedback Section */}
        {analysisResult && (
          <section className="mb-20">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-text-dark">
                  {t('pest.feedback.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={feedback.rating}
                  onValueChange={(value) => setFeedback(prev => ({ ...prev, rating: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Helpful" id="helpful" />
                    <Label htmlFor="helpful">{t('pest.feedback.helpful')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Partially Helpful" id="somewhat" />
                    <Label htmlFor="somewhat">{t('pest.feedback.somewhat')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Not Accurate" id="notHelpful" />
                    <Label htmlFor="notHelpful">{t('pest.feedback.notHelpful')}</Label>
                  </div>
                </RadioGroup>

                <div className="space-y-2">
                  <Label htmlFor="comment">{t('pest.feedback.comment')}</Label>
                  <Textarea
                    id="comment"
                    placeholder={t('pest.feedback.commentPlaceholder')}
                    value={feedback.comment}
                    onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                  />
                </div>

                <Button 
                  onClick={submitFeedback}
                  disabled={isSubmittingFeedback}
                  className="w-full"
                >
                  {isSubmittingFeedback ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    t('pest.feedback.submit')
                  )}
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Common Pests Guide */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-text-dark mb-12 text-center">
            {t('pest.common.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commonPests.map((pest, index) => (
              <Card key={index} className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-text-dark">
                    {pest.name}
                  </CardTitle>
                  <CardDescription className="text-text-medium">
                    {pest.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                      {t('pest.symptoms')}
                    </h4>
                    <ul className="space-y-1">
                      {pest.symptoms.map((symptom, idx) => (
                        <li key={idx} className="text-text-medium text-sm flex items-center">
                          <div className="w-2 h-2 bg-pear rounded-full mr-2"></div>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-text-dark mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {t('pest.treatment')}
                    </h4>
                    <p className="text-text-medium text-sm">{pest.treatment}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PestDetection;